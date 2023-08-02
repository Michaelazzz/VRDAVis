#ifndef ONMESSAGETASK_H_
#define ONMESSAGETASK_H_

#include <string>
#include <tuple>
#include <vector>

#include "Session.h"
#include "SessionManager.h"
#include "Message.h"

namespace vrdavis {

class OnMessageTask {
private:
    static std::shared_ptr<SessionManager> _session_manager;

protected:
    Session* _session;

public:
    OnMessageTask(Session* session) : _session(session) {
        _session->IncreaseRefCount();
    }
    virtual ~OnMessageTask() {
        if(!_session->DecreaseRefCount()) {
            spdlog::info("({}) Remove Session {} in ~OMT", fmt::ptr(_session), _session->GetId());
            if (_session_manager) {
                _session_manager->DeleteSession(_session->GetId());
            }
        }
        _session = nullptr;
    }
    static void SetSessionManager(std::shared_ptr<SessionManager>& session_manager) {
        _session_manager = session_manager;
    }
    virtual OnMessageTask* execute() = 0;
};

} // namespace vrdavis

#include "OnMessageTask.tcc"

#endif // ONMENSSAGETASK_H_