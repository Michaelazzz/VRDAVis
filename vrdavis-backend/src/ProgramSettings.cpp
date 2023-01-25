#include "ProgramSettings.h"

#include <fstream>
#include <iostream>

#include <spdlog/fmt/fmt.h>
#include <cxxopts/cxxopts.hpp>

#include <casacore/images/Images/ImageOpener.h>

#include "Util/App.h"

using json = nlohmann::json;