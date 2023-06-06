#ifndef MESSAGE_H_
#define MESSAGE_H_

#include <vrdavis-protobuf/register_viewer.pb.h>
#include <vrdavis-protobuf/file_list.pb.h>

namespace vrdavis {
const uint16_t ICD_VERSION = 1;
struct EventHeader {
    uint16_t type;
    uint16_t icd_version;
    uint32_t request_id;
};
} // namespace vrdavis

class Message {
    Message() {}
    ~Message() = default;

public:
    // Request messages
    static VRDAVis::RegisterViewer RegisterViewer(uint32_t session_id);
    static VRDAVis::FileListRequest FileListRequest(const std::string& directory);
    
    // Response messages
    // none so far

    // Decode messages
    static VRDAVis::EventType EventType(std::vector<char>& message);

    template <typename T>
    static T DecodeMessage(std::vector<char>& message) {
        T decoded_message;
        char* event_buf = message.data() + sizeof(vrdavis::EventHeader);
        int event_length = message.size() - sizeof(vrdavis::EventHeader);
        decoded_message.ParseFromArray(event_buf, event_length);
        return decoded_message;
    }
};

#endif // MESSAGE_H_