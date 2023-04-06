#ifndef UTIL_FILE_H_
#define UTIL_FILE_H_

#include <vrdavis-protobuf/enums.pb.h>

#include "FileSystem.h"

// file list
#define FILE_LIST_FIRST_PROGRESS_AFTER_SECS 5
#define FILE_LIST_PROGRESS_INTERVAL_SECS 2

// file ids
#define ALL_FILES -1

// directory functions
int GetNumItems(const std::string& path);
fs::path SearchPath(std::string filename);

#endif // UTIL_FILE_H_