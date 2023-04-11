#include "Session.h"

#include <signal.h>
#include <sys/time.h>
#include <algorithm>
#include <chrono>
#include <limits>
#include <memory>
#include <thread>
#include <tuple>
#include <vector>

#include <vrdavis-protobuf/defs.pb.h>
#include <vrdavis-protobuf/raster_cube.pb.h>

#include "Message.h"

using json = nlohmann::json;

using namespace vrdavis;

volatile int Session::_num_sessions = 0;
int Session::_exit_after_num_seconds = 5;
bool Session::_exit_when_all_sessions_closed = false;

Session::Session(uWS::WebSocket<false, true, PerSocketData>* ws, uWS::Loop* loop, uint32_t id, std::string address, std::string folder) 
    : _socket(ws)
    , _loop(loop), 
    _id(id), 
    _address(address),
    _folder(folder) {
    _ref_count = 0;
    _connected = true;
    ++_num_sessions;
    UpdateLastMessageTimestamp();
    std::cout << fmt::ptr(this) << "::Session ({" << _id << "}:{" << _num_sessions << "})" << std::endl;
}

static int __exit_backend_timer = 0;

void ExitNoSessions(int s) {
    if (Session::NumberOfSessions() > 0) {
        struct sigaction sig_handler;
        sig_handler.sa_handler = nullptr;
        sigemptyset(&sig_handler.sa_mask);
        sig_handler.sa_flags = 0;
        sigaction(SIGINT, &sig_handler, nullptr);
    } else {
        --__exit_backend_timer;
        if (!__exit_backend_timer) {
            std::cout << "No sessions timeout." << std::endl;
            exit(0);
        }
        alarm(1);
    }
}

Session::~Session() {
    --_num_sessions;
    if (!_num_sessions) {
        std::cout << "No remaining sessions." << std::endl;
        if (_exit_when_all_sessions_closed) {
            if (_exit_after_num_seconds == 0) {
                // spdlog::debug("Exiting due to no sessions remaining");
                std::cout << "Exiting due to no sessions remaining." << std::endl;
                __exit_backend_timer = 1;
            } else {
                __exit_backend_timer = _exit_after_num_seconds;
            }
            struct sigaction sig_handler;
            sig_handler.sa_handler = ExitNoSessions;
            sigemptyset(&sig_handler.sa_mask);
            sig_handler.sa_flags = 0;
            sigaction(SIGALRM, &sig_handler, nullptr);
            struct itimerval itimer;
            itimer.it_interval.tv_sec = 0;
            itimer.it_interval.tv_usec = 0;
            itimer.it_value.tv_sec = 0;
            itimer.it_value.tv_usec = 5;
            setitimer(ITIMER_REAL, &itimer, nullptr);
        }
    }
}

// *********************************************************************************
// VRDAVis ICD implementation

void Session::OnRegisterViewer(const VRDAVis::RegisterViewer& message, uint16_t icd_version, uint32_t request_id) {
    // std::cout << "Session::OnRegisterViewer => request id: " << request_id << std::endl;
    
    auto session_id = message.session_id();
    // std::cout << "Session id: " << !session_id << std::endl;
    bool success(true);
    std::string status;
    VRDAVis::SessionType type(VRDAVis::SessionType::NEW);

    if (icd_version != ICD_VERSION) {
        // std::cout << "Invalid ICD version number. Expected " << ICD_VERSION << ", got " << icd_version << std::endl;
        status = fmt::format("Invalid ICD version number. Expected {}, got {}", ICD_VERSION, icd_version);
        success = false;
    } 
    else if (!session_id) {
        session_id = _id;
        // std::cout << "Start a new frontend and assign it with session id " << session_id << std::endl;
        status = fmt::format("Start a new frontend and assign it with session id {}", session_id);
    } 
    else {
        type = VRDAVis::SessionType::RESUMED;
        if (session_id != _id) {
            // spdlog::info("({}) Session setting id to {} (was {}) on resume", fmt::ptr(this), session_id, _id);
            //std::cout << "(" << fmt::ptr(this) << ") Session setting id to " << session_id << " (was " << _id << ") on resume" << std::endl;
            _id = session_id;
            // spdlog::info("({}) Session setting id to {}", fmt::ptr(this), session_id);
            //std::cout << "(" << fmt::ptr(this) << ") Session setting id to " << session_id << std::endl;
            status = fmt::format("Start a new backend and assign it with session id {}", session_id);
            // std::cout << "Start a new backend and assign it with session id " << session_id << std::endl;
        } else {
            status = fmt::format("Network reconnected with session id {}", session_id);
        }
    }

    // response
    VRDAVis::RegisterViewerAck ack_message;
    ack_message.set_session_id(session_id);
    ack_message.set_success(success);
    ack_message.set_message(status);
    // ack_message.set_session_type(type);

//     auto& platform_string_map = *ack_message.mutable_platform_strings();
//     platform_string_map["release_info"] = GetReleaseInformation();
// #if __APPLE__
//     platform_string_map["platform"] = "macOS";
// #else
//     platform_string_map["platform"] = "Linux";
// #endif

    // uint32_t feature_flags;
    // if (_read_only_mode) {
    //     feature_flags = CARTA::ServerFeatureFlags::READ_ONLY;
    // } else {
    //     feature_flags = CARTA::ServerFeatureFlags::SERVER_FEATURE_NONE;
    // }
    // if (_enable_scripting) {
    //     feature_flags |= CARTA::ServerFeatureFlags::SCRIPTING;
    // }
    // ack_message.set_server_feature_flags(feature_flags);

    std::cout << status << std::endl;

    SendEvent(VRDAVis::EventType::REGISTER_VIEWER_ACK, request_id, ack_message);
}

void Session::OnFileListRequest(const VRDAVis::FileListRequest& request, uint32_t request_id) {
    // auto progress_callback = [&](VRDAVis::ListProgress progress) { SendEvent(VRDAVis::EventType::FILE_LIST_PROGRESS, request_id, progress); };
    // _file_list_handler->SetProgressCallback(progress_callback);
    VRDAVis::FileListResponse response;
    FileListHandler::ResultMsg result_msg;
    _file_list_handler->OnFileListRequest(request, response, result_msg);
    if (!response.cancel()) {
        SendEvent(VRDAVis::EventType::FILE_LIST_RESPONSE, request_id, response);
    }
    if (!result_msg.message.empty()) {
        // SendLogEvent(result_msg.message, result_msg.tags, result_msg.severity);
    }
}

void Session::SendVolumeData() {
    // generate data
    int size = 128 * 128 * 128; 

    json dataMessage;
    dataMessage["data"] = {};
    for (int i = 0; i < (size); i++) {
        float r = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
        dataMessage["data"].push_back(r);
    }
    dataMessage["type"] = "data";
    _socket->send(dataMessage.dump(), uWS::OpCode::TEXT, false);
}

void Session::SetInitExitTimeout(int secs) {
    __exit_backend_timer = secs;
    struct sigaction sig_handler;
    sig_handler.sa_handler = ExitNoSessions;
    sigemptyset(&sig_handler.sa_mask);
    sig_handler.sa_flags = 0;
    sigaction(SIGALRM, &sig_handler, nullptr);
    alarm(1);
}

void Session::ConnectCalled() {
    _connected = true;
    _base_context.reset();
}

// *********************************************************************************
// SEND uWEBSOCKET MESSAGES

// Sends an event to the client with a given event name (padded/concatenated to 32 characters) and a given ProtoBuf message
void Session::SendEvent(VRDAVis::EventType event_type, u_int32_t event_id, const google::protobuf::MessageLite& message) {
    std::cout << "Session::SendEvent" << std::endl;
    std::cout << "\ttype: " << event_type << std::endl;
    std::cout << "\tid: " << event_id << std::endl;
    
    size_t message_length = message.ByteSizeLong();
    size_t required_size = message_length + sizeof(EventHeader);
    // std::pair<std::vector<char>, bool> msg_vs_compress;
    std::vector<char> msg;
    msg.resize(required_size, 0);
    EventHeader* head = (EventHeader*)msg.data();

    head->type = event_type;
    head->icd_version = ICD_VERSION;
    head->request_id = event_id;
    message.SerializeToArray(msg.data() + sizeof(EventHeader), message_length);
    // Skip compression on files smaller than 1 kB
    // msg_vs_compress.second = compress && required_size > 1024;
    // _out_msgs.push(msg_vs_compress);

    // uWS::Loop::defer(function) is the only thread-safe function, use it to defer the calling of a function to the thread that runs the
    // Loop.
    if (_socket) {
        // _loop->defer([&]() {
            // std::pair<std::vector<char>, bool> msg;
            if (_connected) {
                std::string_view sv(msg.data(), msg.size());
                // _socket->cork([&]() {
                    auto status = _socket->send(sv, uWS::OpCode::BINARY, false);
                    if (status == uWS::WebSocket<false, true, PerSocketData>::DROPPED) {
                        std::cout << "Failed to send message of size " << sv.size() / 1024.0 << " kB" << std::endl;
                    }
                // });
            }
        // });
    }
}

// void Session::SendLogEvent(const std::string& message, std::vector<std::string> tags, VRDAVis::ErrorSeverity severity) {
//     VRDAVis::ErrorData error_data;
//     VRDAVis::
//     error_data.set_message(message);
//     error_data.set_severity(severity);
//     *error_data.mutable_tags() = {tags.begin(), tags.end()};
//     SendEvent(VRDAVis::EventType::ERROR_DATA, 0, error_data);
//     if ((severity > VRDAVis::ErrorSeverity::DEBUG)) {
//         // spdlog::debug("Session {}: {}", _id, message);
//         std::cout << "Session " << _id << ": " << message << std::endl;
//     }
// }

void Session::UpdateLastMessageTimestamp() {
    _last_message_timestamp = std::chrono::high_resolution_clock::now();
}

std::chrono::high_resolution_clock::time_point Session::GetLastMessageTimestamp() {
    return _last_message_timestamp;
}