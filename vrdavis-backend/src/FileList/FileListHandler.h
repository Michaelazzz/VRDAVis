// file list handler for all users' requests

#ifndef FILELISTHANDLER_H_
#define FILELISTHANDLER_H_

#include <functional>
#include <mutex>
#include <unordered_map>

#include <vrdavis-protobuf/file_list.pb.h>

namespace vrdavis {
class FileListHandler {
public:
    FileListHandler(const std::string& folder);

    struct ResultMsg {
        std::string message;
        std::vector<std::string> tags;
        VRDAVis::ErrorSeverity severity;
    };

    // void GetFileList(VRDAVis::FileListResponse& file_list, std::string folder, ResultMsg& result_msg);
    void GetFileList();

    void OnFileListRequest(const VRDAVis::FileListRequest& request, VRDAVis::FileListResponse& response, ResultMsg& result_msg);

    void StopGettingFileList() {
        _stop_getting_file_list = true;
    }
    // void SetProgressCallback(const std::function<void(VRDAVis::ListProgress)>& progress_callback) {
    //     _progress_callback = progress_callback;
    // }
private:
    // ICD: File/Region list response
    

    // void GetRelativePath(std::string& folder);

    // lock on file list handler
    std::mutex _file_list_mutex;
    std::string _filelist_folder;
    std::string _folder;

    volatile bool _stop_getting_file_list;
    volatile bool _first_report_made;
    // std::function<void(VRDAVis::ListProgress)> _progress_callback;
};
} // namespace vrdavis

#endif // FILELISTHANDLER_H_