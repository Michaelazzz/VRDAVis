#include "ProgramSettings.h"

#include <fstream>
#include <iostream>

#include <spdlog/fmt/fmt.h>
#include <cxxopts/cxxopts.hpp>

// #include "Util/App.h"

using json = nlohmann::json;

namespace vrdavis {
    template <class T>
    void applyOptionalArgument(T& val, const std::string& argument_name, const cxxopts::ParseResult& results) {
        if (results.count(argument_name)) {
            val = results[argument_name].as<T>();
        }
    }

    ProgramSettings::ProgramSettings(int argc, char** argv) {
        if (argc > 1) {
            debug_msgs.push_back("Using command-line settings");
        }
        // ApplyCommandLineSettings(argc, argv);
        // ApplyJSONSettings();
        // Push files after all settings are applied
        // PushFilePaths();

        // Apply deprecated no_http flag
        // if (no_http) {
        //     no_frontend = true;
        //     no_database = true;
        // }
    }
} // namespace vrdavis