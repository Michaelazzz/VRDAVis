#ifndef ONMESSAGETASK_TCC_
#define ONMESSAGETASK_TCC_

namespace vrdavis {

template <typename T>
class GeneralMessageTask : public OnMessageTask {
    OnMessageTask* execute() {
        if constexpr (std::is_same_v<T, VRDAVis::FileListRequest>) {
            std::cout << "onmessage task" << std::endl;
            _session->OnFileListRequest(_message, _request_id);
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