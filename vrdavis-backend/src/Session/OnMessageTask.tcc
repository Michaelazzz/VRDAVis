#ifndef ONMESSAGETASK_TCC_
#define ONMESSAGETASK_TCC_

namespace vrdavis {

template <typename T>
class GeneralMessageTask : public OnMessageTask {
    OnMessageTask* execute() {
        if constexpr (std::is_same_v<T, VRDAVis::AddRequiredCubes>) {
            _session->OnAddRequiredCubes(_message, _request_id);
        } else if constexpr (std::is_same_v<T, VRDAVis::FileListRequest>) {
            _session->OnFileListRequest(_message, _request_id);
        } else if constexpr (std::is_same_v<T, VRDAVis::RegionStatsRequest>) {
            _session->OnRegionStatsRequest(_message, _request_id);
        } else {
            spdlog::warn("Bad event type for GeneralMessageTask!");
        }
        return nullptr;
    };

    T _message;
    uint32_t _request_id;

public:
    GeneralMessageTask(Session* session, T message, uint32_t request_id)
        : OnMessageTask(session), _message(message), _request_id(request_id) {}
    ~GeneralMessageTask() = default;
};

} // namespace vrdavis

#endif // ONMESSAGETASK_TCC_