#include "Message.h"

#include <chrono>

VRDAVis::RegisterViewer Message::RegisterViewer(uint32_t session_id) {
    VRDAVis::RegisterViewer register_viewer;
    register_viewer.set_session_id(session_id);
    // register_viewer.set_api_key(api_key);
    // register_viewer.set_client_feature_flags(client_feature_flags);
    return register_viewer;
}

VRDAVis::FileListRequest Message::FileListRequest(const std::string& directory) {
    VRDAVis::FileListRequest file_list_request;
    file_list_request.set_directory(directory);
    return file_list_request;
}

VRDAVis::EventType Message::EventType(std::vector<char>& message) {
    vrdavis::EventHeader head = *reinterpret_cast<const vrdavis::EventHeader*>(message.data());
    return static_cast<VRDAVis::EventType>(head.type);
}