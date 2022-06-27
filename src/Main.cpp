// #include "HttpServer.h"

#include <cstdlib>
#include <iostream>
#include <thread>
#include <vector>

#include <nlohmann/json.hpp>

#include "HttpServer.h"
#include "SessionManager.h"

using namespace vrdavis;

using json = nlohmann::json;

int main(int argc, char* argv[]) {
    // HttpServer http_server;
    // http_server.RunApp();

    std::unique_ptr<HttpServer> http_server;
    std::shared_ptr<SessionManager> session_manager;

    std::cout << "VRDAVis backend" << std::endl;

    // try {

        // if (settings.wait_time >= 0) {
        //     Session::SetExitTimeout(settings.wait_time);
        // }

        // if (settings.init_wait_time >= 0) {
        //     Session::SetInitExitTimeout(settings.init_wait_time);
        // }

        // Session manager
        session_manager = std::make_shared<SessionManager>();
        // carta::OnMessageTask::SetSessionManager(session_manager);

        // HTTP server
        http_server = std::make_unique<HttpServer>(session_manager);

        session_manager->Listen("0.0.0.0", 9000);

        session_manager->RunApp();

    // } catch (exception& e) {
        // spdlog::critical("{}", e.what());
        // carta::logger::FlushLogFile();
        // return 1;
    // } catch (...) {
        // spdlog::critical("Unknown error");
        // carta::logger::FlushLogFile();
        // return 1;
    // }

    return 0;
}