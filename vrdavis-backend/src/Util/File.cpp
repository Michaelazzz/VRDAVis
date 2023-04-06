#include "File.h"

#include <fstream>

#include "String.h"

int GetNumItems(const std::string& path) {
    try {
        int counter = 0;
        auto it = fs::directory_iterator(path);
        for (const auto& f : it) {
            counter++;
        }
        return counter;
    } catch (fs::filesystem_error) {
        return -1;
    }
}

// quick alternative to bp::search_path that allows us to remove
// boost:filesystem dependency
fs::path SearchPath(std::string filename) {
    std::string path(std::getenv("PATH"));
    std::vector<std::string> path_strings;
    SplitString(path, ':', path_strings);

    try {
        for (auto& p : path_strings) {
            fs::path base_path(p);
            base_path /= filename;
            if (fs::exists(base_path)) {
                return base_path;
            }
        }
    } catch (fs::filesystem_error) {
        return fs::path();
    }
    return fs::path();
}

