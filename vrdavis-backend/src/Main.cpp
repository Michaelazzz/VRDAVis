#include <cstdlib>
#include <iostream>
#include <thread>
#include <vector>

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include "HttpServer/HttpServer.h"
#include "Logger/Logger.h"
#include "ProgramSettings.h"
#include "Session/SessionManager.h"

using namespace vrdavis;
using namespace std;

using json = nlohmann::json;

// Entry point. Parses command line arguments and starts server listening
int main(int argc, char* argv[]) {

    std::unique_ptr<HttpServer> http_server;
    std::shared_ptr<SessionManager> session_manager;

    std::cout << "VRDAVis backend" << std::endl;

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
        // vrdavis::ProgramSettings settings(argc, argv);

        // vrdavis::logger::InitLogger(settings.no_log, settings.verbosity, settings.log_performance, settings.log_protocol_messages, settings.user_directory);
        // settings.FlushMessages(); // flush log messages produced during Program Settings setup

        // if (settings.wait_time >= 0) {
        //     Session::SetExitTimeout(settings.wait_time);
        // }

        // if (settings.init_wait_time >= 0) {
        //     Session::SetInitExitTimeout(settings.init_wait_time);
        // }

        // Session manager
        session_manager = std::make_shared<SessionManager>();
        // vrdavis::OnMessageTask::SetSessionManager(session_manager);

        // HTTP server
        http_server = std::make_unique<HttpServer>(session_manager);

        session_manager->Listen("0.0.0.0", 9000);

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