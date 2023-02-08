#include "HttpServer.h"

#include <vector>

#include "MimeTypes.h"

using json = nlohmann::json;

namespace vrdavis {

const std::string success_string = json({{"success", true}}).dump();

HttpServer::HttpServer(std::shared_ptr<SessionManager> session_manager) : _session_manager(session_manager) {}

void HttpServer::WaitForData(Res* res, Req* req, const std::function<void(const std::string&)>& callback) {
    res->onAborted([res]() { res->writeStatus(HTTP_500)->end(); });

    std::string buffer;
    // Adapted from https://github.com/uNetworking/uWebSockets/issues/805#issuecomment-452182209
    res->onData([callback, buffer = std::move(buffer)](std::string_view data, bool last) mutable {
        buffer.append(data.data(), data.length());
        if (last) {
            callback(buffer);
        }
    });
}

// void HttpServer::RunApp() {
//     std::cout << "VRDAVis Server" << std::endl;

//     struct PerSocketData {
//         /* Fill with user data */
//     };

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
    //         std::cout << "Message: "<< message << std::endl;
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
// }



} // namespace vrdavis