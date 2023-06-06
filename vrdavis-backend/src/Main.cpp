#include <cstdlib>
#include <iostream>
#include <thread>
#include <vector>

// #include <nlohmann/json.hpp>
// #include <spdlog/spdlog.h>

#include "FileList/FileListHandler.h"
#include "HttpServer/HttpServer.h"
#include "Logger/Logger.h"
#include "ProgramSettings.h"
#include "Session/OnMessageTask.h"
#include "Session/SessionManager.h"

using namespace vrdavis;
using namespace std;

using json = nlohmann::json;

// Entry point. Parses command line arguments and starts server listening
int main(int argc, char* argv[]) {
    std::shared_ptr<FileListHandler> file_list_handler;
    std::unique_ptr<HttpServer> http_server;
    std::shared_ptr<SessionManager> session_manager;

    spdlog::info("Data Server is on.");

    try {
        // set up interrupt signal handler
        struct sigaction sig_handler;

        sig_handler.sa_handler = [](int s) {
            spdlog::info("Exiting backend.");
            // ThreadManager::ExitEventHandlingThreads();
            vrdavis::logger::FlushLogFile();
            exit(0);
        };

        sigemptyset(&sig_handler.sa_mask);
        sig_handler.sa_flags = 0;
        sigaction(SIGINT, &sig_handler, nullptr);

        // Main
        vrdavis::ProgramSettings settings(argc, argv);

        if (settings.help || settings.version) {
            exit(0);
        }

        // vrdavis::logger::InitLogger(settings.no_log, settings.verbosity, settings.log_performance, settings.log_protocol_messages, settings.user_directory);
        // settings.FlushMessages(); // flush log messages produced during Program Settings setup

        if (settings.wait_time >= 0) {
            Session::SetExitTimeout(settings.wait_time);
        }

        if (settings.init_wait_time >= 0) {
            Session::SetInitExitTimeout(settings.init_wait_time);
        }

        // One FileListHandler works for all sessions.
        file_list_handler = std::make_shared<FileListHandler>(settings.folder);

        // Session manager
        session_manager = std::make_shared<SessionManager>(settings, file_list_handler);
        vrdavis::OnMessageTask::SetSessionManager(session_manager);

        // HTTP server
        http_server = std::make_unique<HttpServer>(session_manager);

        session_manager->Listen(settings.host, DEFAULT_SOCKET_PORT);

        // string start_info = fmt::format("Listening on port {} with top level folder {}, starting folder {}", DEFAULT_SOCKET_PORT, settings.top_level_folder, settings.starting_folder);
        // if (settings.omp_thread_count > 0) {
        //     start_info += fmt::format(", and {} OpenMP worker threads", settings.omp_thread_count);
        // } else {
        //     start_info += fmt::format(". The number of OpenMP worker threads will be handled automatically.");
        // }
        // spdlog::info(start_info);

        session_manager->RunApp();

    } catch (exception& e) {
        spdlog::critical("{}", e.what());
        vrdavis::logger::FlushLogFile();
        return 1;
    } catch (...) {
        spdlog::critical("Unknown error");
        vrdavis::logger::FlushLogFile();
        return 1;
    }

    return 0;
}