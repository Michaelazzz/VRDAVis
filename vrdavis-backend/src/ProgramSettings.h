#ifndef PROGRAMSETTINGS_H_
#define PROGRAMSETTINGS_H_

#include <iostream>
#include <string>
#include <tuple>
#include <unordered_map>
#include <vector>

#include <nlohmann/json.hpp>

#include "Logger/Logger.h"
#include "Util/FileSystem.h"

#define OMP_THREAD_COUNT -1
#define DEFAULT_SOCKET_PORT 3002

#ifndef VRDAVIS_USER_FOLDER_PREFIX
#define VRDAVIS_USER_FOLDER_PREFIX ".vrdavis"
#endif

namespace vrdavis{
struct ProgramSettings {
    bool version = false;
    std::vector<int> port;
    std::string folder = "ssh -i ~/.ssh/id_rsa ubuntu@vrdavis01.idia.ac.za";
    std::string host = "0.0.0.0";
    std::vector<std::string> files;
    std::vector<fs::path> file_paths;
    int wait_time = -1;
    int init_wait_time = -1;
    int idle_session_wait_time = -1;

    std::string browser;

    bool no_user_config = false;
    bool no_system_config = false;

    nlohmann::json command_line_settings;
    bool system_settings_json_exists = false;
    bool user_settings_json_exists = false;

    fs::path user_directory;

    // clang-format off
    std::unordered_map<std::string, std::string*> strings_keys_map{
        {"host", &host},
        {"folder", &folder}
    };

    std::unordered_map<std::string, std::vector<int>*> vector_int_keys_map {
        {"port", &port}
    };
    
    // clang-format on

    ProgramSettings() = default;
    ProgramSettings(int argc, char** argv);
    void ApplyCommandLineSettings(int argc, char** argv);
    void ApplyJSONSettings();
    void AddDeprecationWarning(const std::string& option, std::string where);
    nlohmann::json JSONSettingsFromFile(const std::string& fsp);
    void SetSettingsFromJSON(const nlohmann::json& j);
    void PushFilePaths();

    // TODO: this is outdated. It's used by the equality operator, which is used by a test.
    // auto GetTuple() const {
    //     return std::tie(help, version, port, omp_thread_count, top_level_folder, starting_folder, host, files, frontend_folder, no_http,
    //         no_browser, no_log, log_performance, log_protocol_messages, debug_no_auth, verbosity, wait_time, init_wait_time,
    //         idle_session_wait_time);
    // }
    bool operator!=(const ProgramSettings& rhs) const;
    bool operator==(const ProgramSettings& rhs) const;

    std::vector<std::string> warning_msgs;
    std::vector<std::string> debug_msgs;
    void FlushMessages() {
        std::for_each(warning_msgs.begin(), warning_msgs.end(), [](const std::string& msg) { spdlog::warn(msg); });
        std::for_each(debug_msgs.begin(), debug_msgs.end(), [](const std::string& msg) { spdlog::debug(msg); });
        warning_msgs.clear();
        debug_msgs.clear();
    }
};

} // namespace vrdavis
#endif // PROGRAMSETTINGS_H_