#ifndef SESSIONMANAGER_H_
#define SESSIONMANAGER_H_

#include <spdlog/fmt/fmt.h>

#include <uWebSockets/App.h>
#include <vector>

#include "ProgramSettings.h"
#include "Session.h"

#define MAX_SOCKET_PORT_TRIALS 100

namespace vrdavis {
class SessionManager {
public:
    using WSType = uWS::WebSocket<false, true, PerSocketData>;
    SessionManager(ProgramSettings& settings, std::shared_ptr<FileListHandler>);
    void DeleteSession(uint32_t session_id);
    void OnUpgrade(uWS::HttpResponse<false>* http_response, uWS::HttpRequest* http_request, struct us_socket_context_t* context);
    // Called on connection. Creates session objects and assigns UUID to it
    void OnConnect(WSType* ws);
    // Called on disconnect. Cleans up sessions.
    void OnDisconnect(WSType* ws, int code, std::string_view message);
    void OnDrain(WSType* ws);
    void OnMessage(WSType* ws, std::string_view sv_message, uWS::OpCode op_code);
    void Listen(std::string host, int port);
    uWS::App& App();
    void RunApp();

private:
    // Sessions map
    uint32_t _session_number;
    std::unordered_map<uint32_t, Session*> _sessions;
    // uWebSockets app
    uWS::App _app;
    // Shared objects
    ProgramSettings& _settings;
    std::shared_ptr<FileListHandler> _file_list_handler;

    std::string IPAsText(std::string_view binary);
};

} // namespace vrdavis

#endif // SESSIONMANAGER_H_