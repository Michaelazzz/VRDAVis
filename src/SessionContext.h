#ifndef SESSION_CONTEXT_H_
#define SESSION_CONTEXT_H_

namespace vrdavis {

class SessionContext {
public:
    SessionContext() {
        _cancelled = false;
    }
    void cancel_group_execution() {
        _cancelled = true;
    }
    bool is_group_execution_cancelled() {
        return _cancelled;
    }
    void reset() {
        _cancelled = false;
    }
private:
    volatile bool _cancelled;
};

} // namespace vrdavis

#endif // SESSION_CONTEXT_H_