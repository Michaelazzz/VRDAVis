#ifndef WEBSOCKETSERVER_H_
#define WEBSOCKETSERVER_H_

#include <string>

#include <uWebSockets/App.h>
// #include <nlohmann/json.hpp>

namespace vrdavis {

#define HTTP_200 "200 OK"
#define HTTP_400 "400 Bad Request"
#define HTTP_404 "404 Not Found"
#define HTTP_403 "403 Forbidden"
#define HTTP_500 "500 Internal Server Error"
#define HTTP_501 "501 Not Implemented"

} // end namespace vrdavis

#endif // WEBSOCKETSERVER_H_