#ifndef HTTPSERVER_H_
#define HTTPSERVER_H_

#include <chrono>
#include <string>

#include <uWebSockets/App.h>
#include <nlohmann/json.hpp>

#include "SessionManager.h"

namespace vrdavis {

#define HTTP_200 "200 OK"
#define HTTP_400 "400 Bad Request"
#define HTTP_404 "404 Not Found"
#define HTTP_403 "403 Forbidden"
#define HTTP_500 "500 Internal Server Error"
#define HTTP_501 "501 Not Implemented"

typedef uWS::HttpRequest Req;
typedef uWS::HttpResponse<false> Res;

class HttpServer {
public:
    HttpServer(std::shared_ptr<SessionManager> session_manager);
    // HttpServer();
    void RunApp();
    // void OnConnect(uWS::WebSocket<false, true, vrdavis::HttpServer::PerSocketData> *ws);
    // void OnMessage(uWS::WebSocket<false, true, vrdavis::HttpServer::PerSocketData> *ws, std::string_view message, uWS::OpCode opCode);

    /* ws->getUserData returns one of these */
    struct PerSocketData {
        /* Fill with user data */
    };
private:
    // void WaitForData(Res* res, Req* req, const std::function<void(const std::string&)>& callback);

    std::shared_ptr<SessionManager> _session_manager;
};

} // namespace vrdavis

#endif //HTTPSERVER_H_