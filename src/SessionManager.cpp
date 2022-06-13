#include "SessionManager.h"

using json = nlohmann::json;

namespace vrdavis {

SessionManager::SessionManager() : _session_number(0), _app(uWS::App()) {}

void SessionManager::DeleteSession(uint32_t session_id) {
    Session* session = _sessions[session_id];
    if (session) {
        std::cout << "Session " << session->GetId() << " ["<<session->GetAddress() << "] Deleted. Remaining sessions: " << Session::NumberOfSessions() << std::endl;
        // session->WaitForTaskCancellation();
        // session->CloseAllScriptingRequests();

        if (!session->GetRefCount()) {
            std::cout << "Sessions in Session Map :" << std::endl;
            for (const std::pair<uint32_t, Session*>& ssp : _sessions) {
                Session* ss = ssp.second;
                std::cout << "\tMap id " << ssp.first << ", session id " << ss->GetId() << std::endl;
            }
            delete session;
            _sessions.erase(session_id);
        } 
        // else {
        //     spdlog::info("Session {} reference count is not 0 ({}) at this point in DeleteSession", session_id, session->GetRefCount());
        // }
    } else {
        std::cout << "Could not delete session " << session_id << ": not found!" << std::endl;
    }
}

void SessionManager::OnUpgrade(uWS::HttpResponse<false>* http_response, uWS::HttpRequest* http_request, struct us_socket_context_t* context) {
    std::string address;
    auto ip_header = http_request->getHeader("x-forwarded-for");
    if (!ip_header.empty()) {
        address = ip_header;
    } else {
        address = IPAsText(http_response->getRemoteAddress());
    }

    // if (!ValidateAuthToken(http_request, _auth_token)) {
    //     spdlog::error("Incorrect or missing auth token supplied! Closing WebSocket connection");
    //     http_response->close();
    //     return;
    // }

    auto now = std::chrono::system_clock::now();
    auto now_ms = std::chrono::time_point_cast<std::chrono::microseconds>(now);
    auto epoch = now_ms.time_since_epoch();
    auto value = std::chrono::duration_cast<std::chrono::microseconds>(epoch);
    _session_number = value.count();

    http_response->template upgrade<PerSocketData>({_session_number, address}, //
        http_request->getHeader("sec-websocket-key"),                          //
        http_request->getHeader("sec-websocket-protocol"),                     //
        http_request->getHeader("sec-websocket-extensions"),                   //
        context);
}

void SessionManager::OnConnect(WSType* ws) {
    std::cout << "Client Connected" << std::endl;
    auto socket_data = ws->getUserData();
    if (!socket_data) {
        std::cout << "Error handling WebSocket connection: Socket data does not exist" << std::endl;
        return;
    }

    uint32_t session_id = socket_data->session_id;
    std::string address = socket_data->address;

    // get the uWebsockets loop
    auto* loop = uWS::Loop::get();

    // create a Session
    _sessions[session_id] = new Session(ws, loop, session_id, address);

    _sessions[session_id]->IncreaseRefCount();

    std::cout << "Session " << session_id << " [" << address << "] Connected. Num sessions: " << Session::NumberOfSessions() << std::endl;
}

void SessionManager::OnDisconnect(WSType* ws, int code, std::string_view message) {
    std::cout << "WebSocket closed with code " << code << " and message '" << message << "'." << std::endl;

    if (code == 4003) {
        return;
    }

    // Get the Session object
    uint32_t session_id = static_cast<PerSocketData*>(ws->getUserData())->session_id;

    // Delete the Session
    if (_sessions.count(session_id) > 0) {
        _sessions[session_id]->DecreaseRefCount();
        DeleteSession(session_id);
    }

    // Close the websockets
    ws->close();
}

void SessionManager::OnDrain(WSType* ws) {
    uint32_t session_id = ws->getUserData()->session_id;
    Session* session = _sessions[session_id];
    // if (session) {
        // spdlog::debug("Draining WebSocket backpressure: client {} [{}]. Remaining buffered amount: {} (bytes).", session->GetId(),
            // session->GetAddress(), ws->getBufferedAmount());
    // } 
    // else {
        // spdlog::debug("Draining WebSocket backpressure: unknown client. Remaining buffered amount: {} (bytes).", ws->getBufferedAmount());
    // }
}

void SessionManager::OnMessage(WSType* ws, std::string_view message, uWS::OpCode op_code) {
    std::cout << "Message" << std::endl;
    // uint32_t session_id = static_cast<PerSocketData*>(ws->getUserData())->session_id;
    // Session* session = _sessions[session_id];
    // if (!session) {
    //     std::cout << "Missing session!" << std::endl;
    //     return;
    // }

    // if (op_code == uWS::OpCode::BINARY) {
    //     session->UpdateLastMessageTimestamp();
    // }

    // json jsonObject = json::parse(message);
    // std::cout << message << std::endl;
    // std::string type = jsonObject["type"].dump();
    // type = type.substr(1, (type.length() - 2));
    // std::cout << type << std::endl;

    // if (type == "data") {
    //     // generate data
    //     int size = 128 * 128 * 128; 

    //     json dataMessage;
    //     dataMessage["data"] = {};
    //     for (int i = 0; i < (size); i++) {
    //         float r = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
    //         dataMessage["data"].push_back(r);
    //     }
    //     dataMessage["type"] = "data";
    //     ws->send(dataMessage.dump(), uWS::OpCode::TEXT, false);
    //}
}

void SessionManager::Listen(std::string host, std::vector<int> ports, int default_port, int& port) {
    bool port_ok(false);

    // port = ports[0];
    port = default_port;
    _app.listen(host, port, LIBUS_LISTEN_EXCLUSIVE_PORT, [&](auto* token) {
        if (token) {
            port_ok = true;
            std::cout << "Listening on port " << port << std::endl;
        } else {
            // spdlog::error("Could not listen on port {}!\n", port);
            std::cout << "Could not listen on port " << port << std::endl;
        }
    });
}

uWS::App& SessionManager::App() {
    return _app;
}

void SessionManager::RunApp() {
    std::cout << "Starting Server..." << std::endl;
    _app.ws<PerSocketData>("/*", (uWS::App::WebSocketBehavior<PerSocketData>){
        // Settings
        .compression = uWS::DEDICATED_COMPRESSOR_256KB,
        .maxPayloadLength = 256 * 1024 * 1024,
        .maxBackpressure = 0,
        // Handlers
        .upgrade = nullptr,
        .open = [=](WSType* ws) { OnConnect(ws); },
        .message = [=](WSType* ws, std::string_view msg, uWS::OpCode code) { OnMessage(ws, msg, code); },
        .drain = [=](WSType* ws) { /*OnDrain(ws);*/ },
        .close = [=](WSType* ws, int code, std::string_view msg) { OnDisconnect(ws, code, msg); }
    })
    .run();

    // uWS::App().ws<PerSocketData>("/*", {
    //     /* Settings */
    //     .compression = uWS::CompressOptions(uWS::DEDICATED_COMPRESSOR_256KB ),
    //     .maxPayloadLength = 256 * 1024 * 1024,
    //     .maxBackpressure = 0,
    //     .closeOnBackpressureLimit = false,
    //     .resetIdleTimeoutOnSend = false,
    //     .sendPingsAutomatically = true,
    //     /* Handlers */
    //     .upgrade = nullptr,
    //     .open = [](auto */*ws*/) {
    //         std::cout << "Client Connected" << std::endl;
    //     },
    //     .message = [](auto *ws, std::string_view message, uWS::OpCode opCode) {
    //         json jsonObject = json::parse(message);
    //         std::cout << message << std::endl;
    //         std::string type = jsonObject["type"].dump();
    //         type = type.substr(1, (type.length() - 2));
    //         std::cout << type << std::endl;

    //         if (type == "data") {
    //             // generate data
    //             int size = 128 * 128 * 128; 

    //             json dataMessage;
    //             dataMessage["data"] = {};
    //             for (int i = 0; i < (size); i++) {
    //                 float r = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
    //                 dataMessage["data"].push_back(r);
    //             }
    //             dataMessage["type"] = "data";
    //             ws->send(dataMessage.dump(), uWS::OpCode::TEXT, false);
    //         }
    //     },
    //     .drain = [](auto */*ws*/) {
    //         /* Check ws->getBufferedAmount() here */
    //     },
    //     .ping = [](auto */*ws*/, std::string_view) {
    //         std::cout << "ping" << std::endl;
    //     },
    //     .pong = [](auto */*ws*/, std::string_view) {
    //         std::cout << "pong" << std::endl;
    //     },
    //     .close = [](auto */*ws*/, int /*code*/, std::string_view /*message*/) {
    //         /* You may access ws->getUserData() here */
    //     }
    // })
    // .listen(9000, [](auto *listen_socket) {
    //     if (listen_socket) {
    //         std::cout << "Listening on port " << 9000 << std::endl;
    //     }
    // })
    // .run();
}

std::string SessionManager::IPAsText(std::string_view binary) {
    std::string result;
    if (!binary.length()) {
        return result;
    }

    unsigned char* b = (unsigned char*)binary.data();
    if (binary.length() == 4) {
        result = fmt::format("{0:d}.{1:d}.{2:d}.{3:d}", b[0], b[1], b[2], b[3]);
    } else {
        result = fmt::format("::{0:x}{1:x}:{2:d}.{3:d}.{4:d}.{5:d}", b[10], b[11], b[12], b[13], b[14], b[15]);
    }

    return result;
}


} // namespace vrdavis