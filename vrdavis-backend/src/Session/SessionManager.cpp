#include <spdlog/spdlog.h>

#include "Session/SessionManager.h"
#include "OnMessageTask.h"
#include "Message.h"

using json = nlohmann::json;

namespace vrdavis {

SessionManager::SessionManager(ProgramSettings& settings, std::shared_ptr<FileListHandler> file_list_handler) 
    : _session_number(0), _app(uWS::App()), _settings(settings), _file_list_handler(file_list_handler) {}

void SessionManager::DeleteSession(uint32_t session_id) {
    Session* session = _sessions[session_id];
    if (session) {
        // std::cout << "Session " << session->GetId() << " ["<<session->GetAddress() << "] Deleted. Remaining sessions: " << Session::NumberOfSessions() << std::endl;
        spdlog::info(
            "Session {} [{}] Deleted. Remaining sessions: {}", session->GetId(), session->GetAddress(), Session::NumberOfSessions());
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
        else {
            spdlog::info("Session {} reference count is not 0 ({}) at this point in DeleteSession", session_id, session->GetRefCount());
        }
    } else {
        spdlog::warn("Could not delete session {}: not found!", session_id);
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
    // std::cout << "Client connected" << std::endl;
    // std::cout << ws->getRemoteAddressAsText() << std::endl;

    auto socket_data = ws->getUserData();
    if (!socket_data) {
        spdlog::error("Error handling WebSocket connection: Socket data does not exist");
        return;
    }

    uint32_t session_id = socket_data->session_id;
    std::string address = socket_data->address;

    // std::cout << "Session::onConnect => session_id: " << socket_data->session_id << std::endl;

    // get the uWebsockets loop
    auto* loop = uWS::Loop::get();

    // create a Session
    _sessions[session_id] = new Session(ws, loop, session_id, address, _settings.folder);

    _sessions[session_id]->IncreaseRefCount();

    spdlog::info("Session {} [{}] Connected. Num sessions: {}", session_id, address, Session::NumberOfSessions());
}

void SessionManager::OnDisconnect(WSType* ws, int code, std::string_view message) {
    spdlog::debug("WebSocket closed with code {} and message '{}'.", code, message);

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
    if (session) {
        spdlog::debug("Draining WebSocket backpressure: client {} [{}]. Remaining buffered amount: {} (bytes).", session->GetId(),
            session->GetAddress(), ws->getBufferedAmount());
    } 
    else {
        spdlog::debug("Draining WebSocket backpressure: unknown client. Remaining buffered amount: {} (bytes).", ws->getBufferedAmount());
    }
}

void SessionManager::OnMessage(WSType* ws, std::string_view sv_message, uWS::OpCode op_code) {
    uint32_t session_id = static_cast<PerSocketData*>(ws->getUserData())->session_id;
    Session* session = _sessions[session_id];
    if (!session) {
        spdlog::error("Missing session!");
        return;
    }

    if (op_code == uWS::OpCode::BINARY) {
        if (sv_message.length() >= sizeof(EventHeader)) {
            session->UpdateLastMessageTimestamp();

            EventHeader head = *reinterpret_cast<const EventHeader*>(sv_message.data());
            const char* event_buf = sv_message.data() + sizeof(EventHeader);
            int event_length = sv_message.length() - sizeof(EventHeader);

            VRDAVis::EventType event_type = static_cast<VRDAVis::EventType>(head.type);

            auto event_type_name = VRDAVis::EventType_Name(VRDAVis::EventType(event_type));

            bool message_parsed(false);
            // thread manager task
            OnMessageTask* tsk = nullptr;

            switch (event_type) {
                case VRDAVis::EventType::REGISTER_VIEWER: {
                    spdlog::info("Register viewer message received");
                    VRDAVis::RegisterViewer message;
                    if (message.ParseFromArray(event_buf, event_length)) {
                        session->OnRegisterViewer(message, head.icd_version, head.request_id);
                        message_parsed = true;
                    }
                    break;
                }
                case VRDAVis::EventType::FILE_LIST_REQUEST: {
                    spdlog::info("File list request message received");
                    VRDAVis::FileListRequest message;
                    if (message.ParseFromArray(event_buf, event_length)) {
                        // tsk = new GeneralMessageTask<VRDAVis::FileListRequest>(session, message, head.request_id);
                        session->OnFileListRequest(message, head.request_id);
                        message_parsed = true;
                    }
                    break;
                }
                case VRDAVis::EventType::FILE_INFO_REQUEST: {
                    VRDAVis::FileInfoRequest message;
                    if (message.ParseFromArray(event_buf, event_length)) {
                        session->OnFileInfoRequest(message, head.request_id);
                        message_parsed = true;
                    }
                    break;
                }
                case VRDAVis::EventType::OPEN_FILE: {
                    VRDAVis::OpenFile message;
                    if (message.ParseFromArray(event_buf, event_length)) {
                        session->OnOpenFile(message, head.request_id);
                        message_parsed = true;
                    }
                    break;
                }
                case VRDAVis::EventType::ADD_REQUIRED_CUBES: {
                    VRDAVis::AddRequiredCubes message;
                    if (message.ParseFromArray(event_buf, event_length)) {
                        // tsk has to go through task manager
                        // tsk = new GeneralMessageTask<VRDAVis::AddRequiredCubes>(session, message, head.request_id);
                        session->OnAddRequiredCubes(message, head.request_id);
                        message_parsed = true;
                    }
                    break;
                }
                default: {
                    spdlog::warn("Bad event type {}!", event_type);
                    break;
                }
            }

            if (!message_parsed) {
                spdlog::warn("Bad {} message!", event_type_name);
            }

            // if (tsk) {
            //     ThreadManager::QueueTask(tsk);
            // }
        }
    } else if (op_code == uWS::OpCode::TEXT) {
        if (sv_message == "PING") {
            auto t_session = session->GetLastMessageTimestamp();
            auto t_now = std::chrono::high_resolution_clock::now();
            auto dt = std::chrono::duration_cast<std::chrono::seconds>(t_now - t_session);
            // if ((_settings.idle_session_wait_time > 0) && (dt.count() >= _settings.idle_session_wait_time)) {
            //     std::cout << "Client " << session->GetId() << " has been idle for " << dt.count() << " seconds. Disconnecting.." <<std::endl;
            //     ws->close();
            // } else {
            //     ws->send("PONG", uWS::OpCode::TEXT);
            // }
        }
    }
}

void SessionManager::Listen(std::string host, int port) {
    bool port_ok(false);

    // port = ports[0];
    // port = default_port;
    _app.listen(host, port, LIBUS_LISTEN_EXCLUSIVE_PORT, [&](auto* token) {
        if (token) {
            port_ok = true;
            spdlog::info("Listening on port {}", port);
        } else {
            spdlog::error("Could not listen on port {}!\n", port);
            // std::cout << "Could not listen on port " << port << std::endl;
        }
    });
}

uWS::App& SessionManager::App() {
    return _app;
}

void SessionManager::RunApp() {
    // std::cout << "Starting Server..." << std::endl;
    _app.ws<PerSocketData>("/*", (uWS::App::WebSocketBehavior<PerSocketData>){
        // Settings
        .compression = uWS::DEDICATED_COMPRESSOR_256KB,
        .maxPayloadLength = 256 * 1024 * 1024,
        .maxBackpressure = 0,
        // Handlers
        .upgrade = [=](uWS::HttpResponse<false>* res, uWS::HttpRequest* req,
            struct us_socket_context_t* ctx) { OnUpgrade(res, req, ctx); },
        .open = [=](WSType* ws) { OnConnect(ws); },
        .message = [=](WSType* ws, std::string_view msg, uWS::OpCode code) { OnMessage(ws, msg, code); },
        .drain = [=](WSType* ws) { OnDrain(ws); },
        .close = [=](WSType* ws, int code, std::string_view msg) { OnDisconnect(ws, code, msg); }
    })
    .run();
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