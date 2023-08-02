#include "FileListHandler.h"

#include <fstream>

#include <spdlog/fmt/fmt.h>

#include "Util/File.h"

using namespace vrdavis;

// Default constructor
FileListHandler::FileListHandler(const std::string& folder)
    : _folder(folder) {}

void FileListHandler::OnFileListRequest(const VRDAVis::FileListRequest& request, VRDAVis::FileListResponse& response, ResultMsg& result_msg) {
    std::string requestedFolder = request.directory();

    if(requestedFolder.empty()) {
        requestedFolder = _folder;
    }
        
    // get file list response and result message if any
    GetFileList(response, requestedFolder, result_msg);
}

void FileListHandler::GetFileList(VRDAVis::FileListResponse& file_list, std::string folder, ResultMsg& result_msg) {
    file_list.set_directory(folder);
    std::string message;

    for (const auto & entry : fs::directory_iterator(folder)) {
        std::string name = entry.path().filename();
        // add to file list: name, type, size, date
        auto& file_info = *file_list.add_files();
        file_info.set_name(name);
        file_info.set_size(entry.file_size());
    }
    file_list.set_success(true);
}
