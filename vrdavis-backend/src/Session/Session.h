#ifndef SESSION_H_
#define SESSION_H_

#include <atomic>
#include <cstdint>
#include <cstdio>
#include <map>
#include <mutex>
#include <tuple>
#include <unordered_map>
#include <utility>
#include <vector>

#include <spdlog/fmt/fmt.h>
#include <uWebSockets/App.h>
#include <nlohmann/json.hpp>

#include <vrdavis-protobuf/close_file.pb.h>
#include <vrdavis-protobuf/file_info.pb.h>
#include <vrdavis-protobuf/file_list.pb.h>
#include <vrdavis-protobuf/register_viewer.pb.h>
#include <vrdavis-protobuf/resume_session.pb.h>
#include <vrdavis-protobuf/open_file.pb.h>
#include <vrdavis-protobuf/cubes.pb.h>

#include "FileData/Hdf5Loader.h"
#include "FileList/FileListHandler.h"
#include "SessionContext.h"

#define LOADER_CACHE_SIZE 25

namespace vrdavis {

struct PerSocketData {
    uint32_t session_id;
    std::string address;
};

class Session {
public:
    Session(uWS::WebSocket<false, true, PerSocketData>* ws, uWS::Loop* loop, uint32_t id, std::string address, std::string folder);
    ~Session();

    // VRDAVis ICD
    void OnRegisterViewer(const VRDAVis::RegisterViewer& message, uint16_t icd_version, uint32_t request_id);
    void OnFileListRequest(const VRDAVis::FileListRequest& request, uint32_t request_id);
    void OnFileInfoRequest(const VRDAVis::FileInfoRequest& request, uint32_t request_id);
    bool OnOpenFile(const VRDAVis::OpenFile& message, uint32_t request_id, bool silent = false);
    void OnCloseFile(const VRDAVis::CloseFile& message);
    void OnAddRequiredCubes(const VRDAVis::AddRequiredCubes& message, uint32_t request_id, bool skip_data = false);
    void OnResumeSession(const VRDAVis::ResumeSession& message, uint32_t request_id);

    int IncreaseRefCount() {
        return ++_ref_count;
    }
    int DecreaseRefCount() {
        return --_ref_count;
    }
    int GetRefCount() {
        return _ref_count;
    }

    void ConnectCalled();

    static int NumberOfSessions() {
        return _num_sessions;
    }
    SessionContext& Context() {
        return _base_context;
    }

    static void SetExitTimeout(int secs) {
        _exit_after_num_seconds = secs;
        _exit_when_all_sessions_closed = true;
    }

    static void SetInitExitTimeout(int secs);

    inline uint32_t GetId() {
        return _id;
    }

    inline std::string GetAddress() {
        return _address;
    }

    void UpdateLastMessageTimestamp();
    std::chrono::high_resolution_clock::time_point GetLastMessageTimestamp();
protected:
    bool FillFileInfo(VRDAVis::FileInfo& file_info, const std::string& folder, const std::string& filename, std::string& message);
    bool FillExtendedFileInfo(VRDAVis::FileInfoExtended& file_info, const std::string& folder, const std::string& filename, const int& dims, const int& width, const int& height, const int& length, std::string& message);

    // Send protobuf messages
    void SendEvent(VRDAVis::EventType event_type, u_int32_t event_id, const google::protobuf::MessageLite& message, bool compress = true);
    void SendFileEvent(int file_id, VRDAVis::EventType event_type, u_int32_t event_id, google::protobuf::MessageLite& message, bool compress = true);
    void SendLogEvent(const std::string& message, std::vector<std::string> tags, VRDAVis::ErrorSeverity severity);

    // uWebSockets
    uWS::WebSocket<false, true, PerSocketData>* _socket;
    uWS::Loop* _loop;

    uint32_t _id;
    std::string _address;
    std::string _folder;
    std::string _filename;

    // File browser
    std::shared_ptr<FileListHandler> _file_list_handler;

    // File Loader
    Hdf5Loader* _loader;

    // std::unordered_map<int, std::shared_ptr<Cube>> _cubelets;
    // std::mutex _frame_mutex;

    SessionContext _base_context;

    std::atomic<int> _ref_count;
    bool _connected;
    static volatile int _num_sessions;
    static int _exit_after_num_seconds;
    static bool _exit_when_all_sessions_closed;

    // Timestamp for the last protobuf message
    std::chrono::high_resolution_clock::time_point _last_message_timestamp;
};

} // namespace vrdavis

#endif // SESSION_H_