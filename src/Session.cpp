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

using json = nlohmann::json;

using namespace vrdavis;

volatile int Session::_num_sessions = 0;
int Session::_exit_after_num_seconds = 5;
bool Session::_exit_when_all_sessions_closed = false;

Session::Session(uWS::WebSocket<false, true, PerSocketData>* ws, uWS::Loop* loop, uint32_t id, std::string address) 
    : _socket(ws), _loop(loop), _id(id), _address(address) {
    _ref_count = 0;
    _connected = true;
    ++_num_sessions;
    UpdateLastMessageTimestamp();
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
        // spdlog::info("No remaining sessions.");
        if (_exit_when_all_sessions_closed) {
            if (_exit_after_num_seconds == 0) {
                // spdlog::debug("Exiting due to no sessions remaining");
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

// void Session::SendEvent(std::string_view message) {
//     if(_loop && _socket) {
//         _loop->defer([&]() {
//             auto status = _socket->send(message, uWS::OpCode::TEXT, false);
//             if (status == uWS::WebSocket<false, true, PerSocketData>::DROPPED) {
//                 std::cout << "Failed to send message" << std::endl;
//             }
//         }
//     }
// }

void Session::UpdateLastMessageTimestamp() {
    _last_message_timestamp = std::chrono::high_resolution_clock::now();
}

std::chrono::high_resolution_clock::time_point Session::GetLastMessageTimestamp() {
    return _last_message_timestamp;
}