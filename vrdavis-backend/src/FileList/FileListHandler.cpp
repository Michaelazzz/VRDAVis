#include "FileListHandler.h"

#include <fstream>

#include <spdlog/fmt/fmt.h>

// #include "../Logger/Logger.h"
#include "FileInfoLoader.h"
// #include "Timer/ListProgressReporter.h"
#include "Util/File.h"

using namespace vrdavis;

// Default constructor
FileListHandler::FileListHandler(const std::string& folder)
    : _folder(folder) {}

void FileListHandler::OnFileListRequest(const VRDAVis::FileListRequest& request, VRDAVis::FileListResponse& response, ResultMsg& result_msg) {
    std::scoped_lock lock(_file_list_mutex);
    std::string requestedFolder = request.directory();

    // resolve $BASE keyword in folder string
    // if (requestedFolder.find("$BASE") != std::string::npos) {
        // casacore::String folder_string(folder);
        // folder_string.gsub("$BASE", _starting_folder);
        // folder = folder_string;
    // }
    // strip root_folder from folder
    // GetRelativePath(requestedFolder);

    // get file list response and result message if any
    // GetFileList(response, _folder, result_msg);
    GetFileList();
}

// void FileListHandler::GetRelativePath(std::string& folder) {
//     // Remove root folder path from given folder string
//     if (folder.find("./") == 0) {
//         folder.replace(0, 2, ""); // remove leading "./"
//     } else if (folder.find(_folder) == 0) {
//         folder.replace(0, _top_level_folder.length(), ""); // remove root folder path
//         if (folder.front() == '/') {
//             folder.replace(0, 1, "");
//         } // remove leading '/'
//     }
//     if (folder.empty()) {
//         folder = ".";
//     }
// }

// void FileListHandler::GetFileList(VRDAVis::FileListResponse& file_list, std::string folder, ResultMsg& result_msg) {
void FileListHandler::GetFileList() {
    // fill FileListResponse
    // file_list.set_directory(folder);
    // std::string message;

    // _stop_getting_file_list = false;
    // bool is_region_file(false);

    for (const auto & entry : fs::directory_iterator(_folder))
        std::cout << entry.path() << std::endl;            

    // file_list.set_success(true);
}

