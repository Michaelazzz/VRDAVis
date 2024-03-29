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
#include <string>

#include <vrdavis-protobuf/defs.pb.h>
#include <vrdavis-protobuf/error.pb.h>
#include <vrdavis-protobuf/cubes.pb.h>
#include <vrdavis-protobuf/cubelet.pb.h>
#include <vrdavis-protobuf/region_stats.pb.h>

#include "DataStream/Compression.h"
#include "DataStream/Cubelet.h"
#include "OnMessageTask.h"
#include "Message.h"
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
        spdlog::info("No remaining sessions.");
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

bool Session::FillExtendedFileInfo(VRDAVis::FileInfoExtended& file_info, const std::string& folder, const std::string& filename, const int& dims, const int& width, const int& height, const int& length, std::string& message) {
    bool file_info_ok(false);
    bool success(false);

    std::string fullname;

    // check if selected file exists
    for (const auto & entry : fs::directory_iterator(folder)) {
        std::string name = entry.path().filename();
        if(name == filename) {
            fullname = name;
            file_info.set_dimensions(dims);
            file_info.set_width(width);
            file_info.set_height(height);
            file_info.set_length(length);
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

    VRDAVis::FileInfoExtended file_info;
    bool info_loaded = FillExtendedFileInfo(file_info, directory, filename, 0, 0, 0, 0, file_message);

    if (info_loaded) {
        try {                                                                                                                                                                                                                                                                                                                                                             
            _loader = new Hdf5Loader();
            _loader->OpenFile(filename, directory);
        }
        catch(const std::exception& e) {
            spdlog::error("Opening file error");
            return false;
        }

        VRDAVis::FileInfoExtended response_file_info;
        response_file_info.set_dimensions(3);
        response_file_info.set_width(_loader->getXDimensions());
        spdlog::info("{}", _loader->_NX);
        response_file_info.set_height(_loader->getYDimensions());
        response_file_info.set_length(_loader->getZDimensions());
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
    // reset region
    _loader->_xRegionStart = -1;
    _loader->_xRegionEnd = -1;
    _loader->_yRegionStart = -1;
    _loader->_yRegionEnd = -1;
    _loader->_zRegionStart = -1;
    _loader->_zRegionEnd = -1;
}

void Session::OnAddRequiredCubes(const VRDAVis::AddRequiredCubes& message, uint32_t request_id, VRDAVis::CompressionType compression_type, bool skip_data) {
    auto file_id = message.file_id();
    int num_cubes = message.cubelets_size();

    ThreadManager::ApplyThreadLimit();

    // open dataset
    std::string dataset = "";
    const std::string encoded_coordinate = message.cubelets(0);
    VRDAVis::CubeletData cubelet_data_message;
    cubelet_data_message.set_file_id(file_id);

    auto cubelet = Cubelet::Decode(encoded_coordinate);
    if(cubelet.mipXY > 1 && cubelet.mipZ > 1) {
        dataset = "/0/MipMaps/DATA/DATA_XYZ_" + std::to_string(cubelet.mipXY) + "_" + std::to_string(cubelet.mipXY) + "_" + std::to_string(cubelet.mipZ);
    } else if(cubelet.mipXY > 1 && cubelet.mipZ == 1) {
        dataset = "/0/MipMaps/DATA/DATA_XY_" + std::to_string(cubelet.mipXY);
    } else if(cubelet.mipZ > 1 && cubelet.mipXY == 1) {
        dataset = "/0/MipMaps/DATA/DATA_Z_" + std::to_string(cubelet.mipZ);
    } else {
        dataset = "/0/DATA";
    }
    spdlog::info("{}", dataset);
    _loader->OpenDataset(dataset);

    for (int i = 0; i < num_cubes; i++) {
        const std::string encoded_coordinate = message.cubelets(i);
        // spdlog::info("Encoded Coordinates {}", encoded_coordinate);
        VRDAVis::CubeletData cubelet_data_message;
        cubelet_data_message.set_file_id(file_id);

        auto cubelet = Cubelet::Decode(encoded_coordinate);

        if (cubelet_data_message.cubelets_size()) {
            cubelet_data_message.clear_cubelets();
        }

        VRDAVis::CubeletParams* cubelet_ptr = cubelet_data_message.add_cubelets();
        cubelet_ptr->set_layerxy(cubelet.mipXY); // mipmap XY layer
        cubelet_ptr->set_layerz(cubelet.mipZ); // mipmap Z layer
        cubelet_ptr->set_x(cubelet.x); // x position/offset
        cubelet_ptr->set_y(cubelet.y); // y position/offset
        cubelet_ptr->set_z(cubelet.z); // z position/offset

        int CUBELET_SIZE_XY = 128;
        int CUBELET_SIZE_Z = 128;
        int xDims = ((cubelet.x*CUBELET_SIZE_XY)+CUBELET_SIZE_XY > _loader->getXDimensions()) ? CUBELET_SIZE_XY - (((cubelet.x*CUBELET_SIZE_XY)+CUBELET_SIZE_XY) - _loader->getXDimensions()) : CUBELET_SIZE_XY;
        int yDims = ((cubelet.y*CUBELET_SIZE_XY)+CUBELET_SIZE_XY > _loader->getYDimensions()) ? CUBELET_SIZE_XY - (((cubelet.y*CUBELET_SIZE_XY)+CUBELET_SIZE_XY) - _loader->getYDimensions()) : CUBELET_SIZE_XY;
        int zDims = ((cubelet.z*CUBELET_SIZE_Z)+CUBELET_SIZE_Z > _loader->getZDimensions()) ? CUBELET_SIZE_Z - (((cubelet.z*CUBELET_SIZE_Z)+CUBELET_SIZE_Z) - _loader->getZDimensions()) : CUBELET_SIZE_Z;
        
        // spdlog::info("{} {} {}", cubelet.x, cubelet.y, cubelet.z);
        // spdlog::info("Cubelet Dimensions {} {} {}", xDims, yDims, zDims);

        size_t volume_data_length = xDims * yDims * zDims;
        float* volume_data_out = new float[volume_data_length];
        float* no_nan_data = new float[volume_data_length];
        // std::shared_ptr<std::vector<float>> volume_data_out;

        // _loader->addToRegion(cubelet.x*CUBELET_SIZE_XY, cubelet.y*CUBELET_SIZE_XY, cubelet.z*CUBELET_SIZE_Z, xDims, yDims, zDims, mipXY, mipZ);
        
        if(_loader->readHdf5Data(
        volume_data_out, 
        { hsize_t(zDims), hsize_t(yDims), hsize_t(xDims) }, 
        { hsize_t(zDims), hsize_t(yDims), hsize_t(xDims) }, 
        { hsize_t(cubelet.z*CUBELET_SIZE_Z), hsize_t(cubelet.y*CUBELET_SIZE_XY), hsize_t(cubelet.x*CUBELET_SIZE_XY) })) {
            // size_t cube_data_size = sizeof(float) * volume_data_out->size(); // cube data size in bytes
            cubelet_ptr->set_height(yDims);
            cubelet_ptr->set_width(xDims);
            cubelet_ptr->set_length(zDims);
            // cubelet_ptr->set_volume_data(volume_data_length, *volume_data_out);
            // SendFileEvent(file_id, VRDAVis::EventType::VOLUME_CUBE_DATA, 0, volume_data, compression_type == VRDAVis::CompressionType::NONE);

            // if (compression_type == VRDAVis::CompressionType::NONE) {
            // uncompressed data
            for (size_t i = 0; i < volume_data_length; i++)
            {
                if(isnanf( volume_data_out[i] )) {
                    cubelet_ptr->add_volume_data(0);
                    no_nan_data[i] = 0;
                } else {
                    cubelet_ptr->add_volume_data(volume_data_out[i]);
                    no_nan_data[i] = volume_data_out[i];
                }
            }
            // } else {
            // compressed data
            // compress the data with a default precision
            std::vector<char> compression_buffer;
            size_t compressed_size;
            float compression_quality = 32.0;
            int precision = lround(compression_quality);
            Compress(no_nan_data, compression_buffer, compressed_size, xDims, yDims, zDims, precision);
            // float compression_ratio = sizeof(float) * volume_data_length / (float)compressed_size;
            // bool use_high_precision(false);

            // set compression data with default precision
            // cubelet_data_message.set_compression_quality(compression_quality);

            // for (const auto& j: compression_buffer)
            //     std::cout << j << ' ';

            // decompress test
            // Decompress(no_nan_data, compression_buffer, xDims, yDims, zDims, precision);
            // for (size_t i = 0; i < volume_data_length; i++)
            // {
            //     std::cout << no_nan_data[i] << " ";
            // }
            
            cubelet_ptr->set_compressed_volume_data(compression_buffer.data(), compressed_size);
            // }
            SendFileEvent(file_id, VRDAVis::EventType::CUBELET_DATA, request_id, cubelet_data_message);
        } else {
            spdlog::error("Data could not be loaded");
            // send error to frontend
            std::vector<std::string> tags;
            SendLogEvent("Data could not be loaded", tags, VRDAVis::ErrorSeverity::CRITICAL);
        }

        // delete pointer
        delete[] volume_data_out;
        delete[] no_nan_data;
    }
}

void Session::OnSetRegionRequest(const VRDAVis::SetRegionRequest& message, uint32_t request_id) {
    SendSetRegionResponse(_loader->setRegion(message.corners(0), message.corners(1), message.corners(2), message.corners(3), message.corners(4), message.corners(5)));
}

void Session::OnRegionStatsRequest(const VRDAVis::RegionStatsRequest& message, uint32_t request_id) {
    VRDAVis::RegionStatsData stats_data_message;
    // stats_data_message.set_file_id(file_id);
    // calculate stats from current region
    spdlog::info("x: {} - {}", _loader->_xRegionStart, _loader->_xRegionEnd);
    spdlog::info("y: {} - {}", _loader->_yRegionStart, _loader->_yRegionEnd);
    spdlog::info("y: {} - {}", _loader->_zRegionStart, _loader->_zRegionEnd);

    // get data to be processed
    int xDims = _loader->_xRegionEnd - _loader->_xRegionStart;
    int yDims = _loader->_yRegionEnd - _loader->_yRegionStart;
    int zDims = _loader->_zRegionEnd - _loader->_zRegionStart;

    size_t volume_data_length = xDims * yDims * zDims;
    float* volume_data_out = new float[volume_data_length];

    _loader->OpenDataset("/0/DATA");

    _loader->readHdf5Data(
        volume_data_out,
        { hsize_t(zDims), hsize_t(yDims), hsize_t(xDims) }, 
        { hsize_t(zDims), hsize_t(yDims), hsize_t(xDims) }, 
        { hsize_t(_loader->_zRegionStart), hsize_t(_loader->_yRegionStart), hsize_t(_loader->_xRegionStart) });

    // calculate stats
    float mean = volume_data_out[0];
    float min = volume_data_out[0];
    float max = volume_data_out[0];

    std::map<float, int> distribution;

    auto nanZeroEnd = std::remove_if(volume_data_out, volume_data_out + volume_data_length, [](float val) {
        return std::isnan(val) || (val == 0 && std::signbit(val));
    });

    int newSize = nanZeroEnd - volume_data_out;

    std::sort(volume_data_out, volume_data_out + newSize);

    float range = volume_data_out[newSize-1] - volume_data_out[0];
    float bucketSize = range / 30;
    std::cout << bucketSize << std::endl;
    
    std::cout << volume_data_out[0] << std::endl;
    std::cout << volume_data_out[newSize-1] << std::endl;
    
    for(int i = 1; i < newSize; i++) {
        // std::cout << volume_data_out[i];
        // std::cout << " ";
        mean += volume_data_out[i];
        if(volume_data_out[i] < min) min = volume_data_out[i];
        if(volume_data_out[i] > max) max = volume_data_out[i];

        float bucketStart = floor(volume_data_out[i] / bucketSize) * bucketSize;
        float bucketEnd = bucketStart + bucketSize;
        distribution[bucketStart]++;

        if (volume_data_out[i] != bucketEnd) {
            distribution[bucketEnd]++;
        }
    }
    // std::cout << std::endl;
    mean /= newSize;

    // determine which statistics are needed
    for(int i = 0; i < message.statistics_size(); i++) {
        if(VRDAVis::StatsType::Mean == message.statistics(i)) {
            spdlog::info("Mean: {}", mean);
            VRDAVis::StatisticsValue* mean_ptr = stats_data_message.add_statistics();
            mean_ptr->set_stats_type(VRDAVis::StatsType::Mean);
            mean_ptr->set_value(mean);
        } 
        if(VRDAVis::StatsType::Min == message.statistics(i)) {
            spdlog::info("Min: {}", volume_data_out[0]);
            VRDAVis::StatisticsValue* min_ptr = stats_data_message.add_statistics();
            min_ptr->set_stats_type(VRDAVis::StatsType::Min);
            min_ptr->set_value(volume_data_out[0]);
        } 
        if(VRDAVis::StatsType::Max == message.statistics(i)) {
            spdlog::info("Max: {}", volume_data_out[newSize-1]);
            VRDAVis::StatisticsValue* max_ptr = stats_data_message.add_statistics();
            max_ptr->set_stats_type(VRDAVis::StatsType::Max);
            max_ptr->set_value(volume_data_out[newSize-1]);
        }
        if(VRDAVis::StatsType::Distribution == message.statistics(i)) {
            
            VRDAVis::StatisticsValue* distribution_ptr = stats_data_message.add_statistics();
            distribution_ptr->set_stats_type(VRDAVis::StatsType::Distribution);
            spdlog::info("Distribution of values in ranges:");
            for (const auto& pair : distribution) {
                // std::cout << "Range: [" << pair.first << ", " << pair.first + bucketSize
                //     << "], Frequency: " << pair.second << std::endl;
                // distribution_ptr->add_values(pair.second);
                distribution_ptr->add_values(pair.second);
                distribution_ptr->add_ranges(pair.first);
            }
            
            // distribution_ptr->set_value(distribution);
        }
    }
    

    if(stats_data_message.statistics_size() == 0) {
        spdlog::error("Invalid statistic type!");
    }
    
    SendEvent(VRDAVis::EventType::REGION_STATS_DATA, request_id, stats_data_message);
}

// bool Session::SendRegionStatsData(int file_id, int region_id) {
//     // return true if data sent
//     bool data_sent(false);
//     if (region_id == ALL_REGIONS && !_region_handler) {
//         return data_sent;
//     }
//     auto region_stats_data_callback = [&](VRDAVis::RegionStatsData region_stats_data) {
//         if (region_stats_data.statistics_size() > 0) {
//             SendFileEvent(region_stats_data.file_id(), VRDAVis::EventType::REGION_STATS_DATA, 0, region_stats_data);
//         }
//     };
//     if ((region_id > CURSOR_REGION_ID) || (region_id == ALL_REGIONS) || (file_id == ALL_FILES)) {
//         // Region stats
//         data_sent = _region_handler->FillRegionStatsData(region_stats_data_callback, region_id, file_id);
//     } else if (region_id == IMAGE_REGION_ID) {
//         // Image stats
//         if (_frames.count(file_id)) {
//             data_sent = _frames.at(file_id)->FillRegionStatsData(region_stats_data_callback, region_id, file_id);
//         }
//     }
//     return data_sent;
// }

void Session::SendSetRegionResponse(bool success) {
    VRDAVis::SetRegionResponse response;
    response.set_success(success);
    SendEvent(VRDAVis::EventType::SET_REGION_RESPONSE, 0, response);
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