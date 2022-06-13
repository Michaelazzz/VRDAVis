#ifndef SESSIONMANAGER_H_
#define SESSIONMANAGER_H_

#include <spdlog/fmt/fmt.h>

#include <uWebSockets/App.h>
#include <vector>

#include "Session.h"

#define MAX_SOCKET_PORT_TRIALS 100

namespace vrdavis {
class SessionManager {
public:
    using WSType = uWS::WebSocket<false, true, PerSocketData>;
    SessionManager();
    void DeleteSession(uint32_t session_id);
    void OnUpgrade(uWS::HttpResponse<false>* http_response, uWS::HttpRequest* http_request, struct us_socket_context_t* context);
    void OnConnect(WSType* ws);
    void OnDisconnect(WSType* ws, int code, std::string_view message);
    void OnDrain(WSType* ws);
    void OnMessage(WSType* ws, std::string_view sv_message, uWS::OpCode op_code);
    void Listen(std::string host, std::vector<int> ports, int default_port, int& port);
    uWS::App& App();
    void RunApp();

private:
    // Sessions map
    uint32_t _session_number;
    std::unordered_map<uint32_t, Session*> _sessions;
    // uWebSockets app
    uWS::App _app;

    std::string IPAsText(std::string_view binary);
};

} // namespace vrdavis

#endif // SESSIONMANAGER_H_