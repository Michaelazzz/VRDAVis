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
#include <vrdavis-protobuf/error.pb.h>
#include <vrdavis-protobuf/cubes.pb.h>
#include <vrdavis-protobuf/volume.pb.h>

#include "OnMessageTask.h"
#include "Message.h"
#include "DataStream/Cube.h"
#include "ThreadingManager/ThreadingManager.h"

using json = nlohmann::json;

using namespace vrdavis;

volatile int Session::_num_sessions = 0;
int Session::_exit_after_num_seconds = 5;
bool Session::_exit_when_all_sessions_closed = false;

Session::Session(uWS::WebSocket<false, true, PerSocketData>* ws, uWS::Loop* loop, uint32_t id, std::string address, std::string folder) 
    : _socket(ws), 
    _loop(loop), 
    _id(id), 
    _address(address),
    _folder(folder),
    _loader() {
    _ref_count = 0;
    _connected = true;
    ++_num_sessions;

    UpdateLastMessageTimestamp();
    spdlog::info("{}::Session ({}:{})", fmt::ptr(this), _id, _num_sessions);
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
            spdlog::info("No sessions timeout.");
            ThreadManager::ExitEventHandlingThreads();
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
                spdlog::debug("Exiting due to no sessions remaining");
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

// ********************************************************************************
// File info

bool Session::FillFileInfo(VRDAVis::FileInfo& file_info, const std::string& folder, const std::string& filename, std::string& message) {
    bool file_info_ok(false);
    bool success(false);

    std::string fullname;

    // check if selected file exists
    for (const auto & entry : fs::directory_iterator(folder)) {
        std::string name = entry.path().filename();
        if(name == filename) {
            fullname = name;
            file_info.set_name(entry.path());
            file_info.set_size(entry.file_size());
            // file_info.set_type(name.substr(name.find_last_of(".") + 1));
            file_info_ok = true;
        }
    }
    
    if (fullname.empty()) {
        message = fmt::format("File {} does not exist.", filename);
        return file_info_ok;
    }

    if (!file_info_ok) {
        message = fmt::format("File info for {} failed.", filename);
    }

    return file_info_ok;
}

// *********************************************************************************
// VRDAVis ICD implementation

void Session::OnRegisterViewer(const VRDAVis::RegisterViewer& message, uint16_t icd_version, uint32_t request_id) {
    auto session_id = message.session_id();
    bool success(true);
    std::string status;
    VRDAVis::SessionType type(VRDAVis::SessionType::NEW);

    if (icd_version != ICD_VERSION) {
        status = fmt::format("Invalid ICD version number. Expected {}, got {}", ICD_VERSION, icd_version);
        success = false;
    } 
    else if (!session_id) {
        session_id = _id;
        status = fmt::format("Start a new frontend and assign it with session id {}", session_id);
    } 
    else {
        type = VRDAVis::SessionType::RESUMED;
        if (session_id != _id) {
            spdlog::info("({}) Session setting id to {} (was {}) on resume", fmt::ptr(this), session_id, _id);
            _id = session_id;
            spdlog::info("({}) Session setting id to {}", fmt::ptr(this), session_id);
            status = fmt::format("Start a new backend and assign it with session id {}", session_id);
        } else {
            status = fmt::format("Network reconnected with session id {}", session_id);
        }
    }

    // response
    VRDAVis::RegisterViewerAck ack_message;
    ack_message.set_session_id(session_id);
    ack_message.set_success(success);
    ack_message.set_message(status);
    ack_message.set_session_type(type);

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
        SendLogEvent(result_msg.message, result_msg.tags, result_msg.severity);
    }
}

void Session::OnFileInfoRequest(const VRDAVis::FileInfoRequest& request, uint32_t request_id) {
    VRDAVis::FileInfoResponse response;
    auto& file_info = *response.mutable_file_info();
    std::string message;
    bool success = FillFileInfo(file_info, request.directory(), request.file(), message);

    // complete response message
    response.set_success(success);
    response.set_message(message);
    SendEvent(VRDAVis::EventType::FILE_INFO_RESPONSE, request_id, response);
}

bool Session::OnOpenFile(const VRDAVis::OpenFile& message, uint32_t request_id, bool silent) {
    // Create Frame and send response message
    const auto& directory(message.directory());
    const auto& filename(message.file());
    // std::string hdu(message.hdu());
    // auto file_id(message.file_id());
    // bool is_lel_expr(message.lel_expr());
    
    // response message:
    VRDAVis::OpenFileAck ack;
    bool success(false);
    std::string file_message;
    std::string err_message;
    std::string fullname;

    VRDAVis::FileInfo file_info;
    bool info_loaded = FillFileInfo(file_info, directory, filename, file_message);

    if (info_loaded) {
        try
        {
            _loader = new Hdf5Loader();
            _loader->OpenFile(filename, directory, "0/DATA");
        }
        catch(const std::exception& e) {
            spdlog::error("Opening file error");
            return false;
        }

        VRDAVis::FileInfo response_file_info = VRDAVis::FileInfo();
        response_file_info.set_name(file_info.name());
        // response_file_info.set_type(file_info.type());
        response_file_info.set_size(file_info.size());
        *ack.mutable_file_info() = response_file_info;

        success = true;
    }

    if (!silent) {
        ack.set_success(success);
        ack.set_message(err_message);
        SendEvent(VRDAVis::EventType::OPEN_FILE_ACK, request_id, ack);
    }

    if (success) {
        // // send histogram with default requirements
        // if (!SendRegionHistogramData(file_id, IMAGE_REGION_ID)) {
        //     std::string message = fmt::format("Image histogram for file id {} failed", file_id);
        //     SendLogEvent(message, {"open_file"}, VRDAVis::ErrorSeverity::ERROR);
        // }
    }
    if (!err_message.empty()) {
        spdlog::error(err_message);
    }
    return success;
}

void Session::OnCloseFile(const VRDAVis::CloseFile& message) {
    // CheckCancelAnimationOnFileClose(message.file_id());
    // _file_settings.ClearSettings(message.file_id());
    // DeleteFrame(message.file_id());
}

void Session::OnAddRequiredCubes(const VRDAVis::AddRequiredCubes& message, uint32_t request_id, bool skip_data) {
    auto file_id = message.file_id();
    int num_cubes = message.cubes_size();

    ThreadManager::ApplyThreadLimit();

    // for (int i = 0; i < num_cubes; i++) {
        // const auto& encoded_coordinate = message.cubes(i);

        VRDAVis::VolumeData volume_data_message;
        volume_data_message.set_file_id(file_id);

        // auto cube = Cube::Decode(encoded_coordinate);

        if (volume_data_message.cubes_size()) {
            volume_data_message.clear_cubes();
        }

        VRDAVis::CubeParams* cube_ptr = volume_data_message.add_cubes();
        // cube_ptr->set_layer(cube.layer);
        // cube_ptr->set_x(cube.x);
        // cube_ptr->set_y(cube.y);
        // cube_ptr->set_z(cube.z);

        cube_ptr->set_layer(1);
        cube_ptr->set_x(0);
        cube_ptr->set_y(0);
        cube_ptr->set_z(0);

        int xDims = _loader->getXDimensions();
        int yDims = _loader->getYDimensions();
        int zDims = _loader->getZDimensions();
        size_t cube_data_length = xDims * yDims * zDims;
        float* volume_data_out = new float[cube_data_length];
        // std::shared_ptr<std::vector<float>> volume_data_out;
        if (_loader->ReadAllData(volume_data_out)) {
            for (size_t i = 0; i < cube_data_length; i++)
            {
                cube_ptr->add_volume_data(volume_data_out[i]);
            }
            // size_t cube_data_size = sizeof(float) * volume_data_out->size(); // cube data size in bytes
            cube_ptr->set_height(xDims);
            cube_ptr->set_width(yDims);
            cube_ptr->set_length(zDims);
            // cube_ptr->set_volume_data(cube_data_length, *volume_data_out);
            // SendFileEvent(file_id, VRDAVis::EventType::VOLUME_CUBE_DATA, 0, volume_data, compression_type == VRDAVis::CompressionType::NONE);
            SendFileEvent(file_id, VRDAVis::EventType::VOLUME_CUBE_DATA, request_id, volume_data_message);
        } 
        else {
            spdlog::error("Data could not be loaded");
            // send error to frontend
            std::vector<std::string> tags;
            SendLogEvent("Data could not be loaded", tags, VRDAVis::ErrorSeverity::CRITICAL);
        }

        // delete pointer
        delete[] volume_data_out;
    // }
}

void Session::OnResumeSession(const VRDAVis::ResumeSession& message, uint32_t request_id) {
    bool success(true);
    spdlog::info("Session {} [{}] Resumed.", GetId(), GetAddress());

    // Error messages
    std::string err_message;
    std::string err_file_ids = "Problem loading files: ";
    
    // Stop the streaming spectral profile, cube histogram and animation processes
    // WaitForTaskCancellation();

    // Clear the message queue
    // _out_msgs.clear();

    // Reconnect the session
    ConnectCalled();

    // Close all images
    VRDAVis::CloseFile close_file_msg;
    close_file_msg.set_file_id(-1);
    OnCloseFile(close_file_msg);

    auto t_start_resume = std::chrono::high_resolution_clock::now();

    // Open images
    // for (int i = 0; i < message.images_size(); ++i) {
    //     const CARTA::ImageProperties& image = message.images(i);
    //     bool file_ok(true);

    //     if (image.stokes_files_size() > 1) {
    //         CARTA::ConcatStokesFiles concat_stokes_files_msg;
    //         concat_stokes_files_msg.set_file_id(image.file_id());
    //         *concat_stokes_files_msg.mutable_stokes_files() = image.stokes_files();

    //         // Open a concatenated stokes file
    //         if (!OnConcatStokesFiles(concat_stokes_files_msg, request_id)) {
    //             success = false;
    //             file_ok = false;
    //             err_file_ids.append(std::to_string(image.file_id()) + " ");
    //         }
    //     } else {
    //         CARTA::OpenFile open_file_msg;
    //         open_file_msg.set_directory(image.directory());
    //         open_file_msg.set_file(image.file());
    //         open_file_msg.set_hdu(image.hdu());
    //         open_file_msg.set_file_id(image.file_id());

    //         // Open a file
    //         if (!OnOpenFile(open_file_msg, request_id, true)) {
    //             success = false;
    //             file_ok = false;
    //             err_file_ids.append(std::to_string(image.file_id()) + " ");
    //         }
    //     }

    //     if (file_ok) {
    //         // Set image channels
    //         CARTA::SetImageChannels set_image_channels_msg;
    //         set_image_channels_msg.set_file_id(image.file_id());
    //         set_image_channels_msg.set_channel(image.channel());
    //         set_image_channels_msg.set_stokes(image.stokes());
    //         OnSetImageChannels(set_image_channels_msg);

    //         // Set regions
    //         for (const auto& region_id_info : image.regions()) {
    //             // region_id_info is <region_id, CARTA::RegionInfo>
    //             if (region_id_info.first == 0) {
    //                 CARTA::Point cursor = region_id_info.second.control_points(0);
    //                 CARTA::SetCursor set_cursor_msg;
    //                 *set_cursor_msg.mutable_point() = cursor;
    //                 OnSetCursor(set_cursor_msg, request_id);
    //             } else {
    //                 CARTA::SetRegion set_region_msg;
    //                 set_region_msg.set_file_id(image.file_id());
    //                 set_region_msg.set_region_id(region_id_info.first);
    //                 CARTA::RegionInfo resume_region_info = region_id_info.second;
    //                 *set_region_msg.mutable_region_info() = resume_region_info;

    //                 if (!OnSetRegion(set_region_msg, request_id, true)) {
    //                     success = false;
    //                     err_region_ids.append(std::to_string(region_id_info.first) + " ");
    //                 }
    //             }
    //         }

    //         // Set contours
    //         if (image.contour_settings().levels_size()) {
    //             OnSetContourParameters(image.contour_settings(), true);
    //         }
    //     }
    // }

    // Open Catalog files
    // for (int i = 0; i < message.catalog_files_size(); ++i) {
    //     const CARTA::OpenCatalogFile& open_catalog_file_msg = message.catalog_files(i);
    //     OnOpenCatalogFile(open_catalog_file_msg, request_id, true);
    // }

    // Measure duration for resume
    auto t_end_resume = std::chrono::high_resolution_clock::now();
    auto dt_resume = std::chrono::duration_cast<std::chrono::microseconds>(t_end_resume - t_start_resume).count();
    spdlog::performance("Resume in {:.3f} ms", dt_resume * 1e-3);

    // RESPONSE
    VRDAVis::ResumeSessionAck ack;
    ack.set_success(success);
    if (!success) {
        err_message = err_file_ids;
        ack.set_message(err_message);
    }
    SendEvent(VRDAVis::EventType::RESUME_SESSION_ACK, request_id, ack);
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
    // std::cout << "Session::SendEvent" << std::endl;
    // std::cout << "\ttype: " << event_type << std::endl;
    // std::cout << "\tid: " << event_id << std::endl;
    
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
                        spdlog::error("Failed to send message of size {} kB", sv.size() / 1024.0);
                    }
                // });
            }
        // });
    }
}

// void Session::SendFileEvent(int32_t file_id, VRDAVis::EventType event_type, uint32_t event_id, google::protobuf::MessageLite& message, bool compress) {
void Session::SendFileEvent(int file_id, VRDAVis::EventType event_type, u_int32_t event_id, google::protobuf::MessageLite& message) {
    // do not send if file is closed
    // if (_frames.count(file_id)) {
        // SendEvent(event_type, event_id, message, compress);
        SendEvent(event_type, event_id, message);
    // }
}

void Session::SendLogEvent(const std::string& message, std::vector<std::string> tags, VRDAVis::ErrorSeverity severity) {
    VRDAVis::ErrorData error_data;
    error_data.set_message(message);
    error_data.set_severity(severity);
    *error_data.mutable_tags() = {tags.begin(), tags.end()};
    SendEvent(VRDAVis::EventType::ERROR_DATA, 0, error_data);
    if ((severity > VRDAVis::ErrorSeverity::DEBUG)) {
        spdlog::debug("Session {}: {}", _id, message);
        // std::cout << "Session " << _id << ": " << message << std::endl;
    }
}

void Session::UpdateLastMessageTimestamp() {
    _last_message_timestamp = std::chrono::high_resolution_clock::now();
}

std::chrono::high_resolution_clock::time_point Session::GetLastMessageTimestamp() {
    return _last_message_timestamp;
}