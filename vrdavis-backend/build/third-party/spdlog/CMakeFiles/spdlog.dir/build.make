# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.16

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/ubuntu/Desktop/VRDAVis/vrdavis-backend

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build

# Include any dependencies generated for this target.
include third-party/spdlog/CMakeFiles/spdlog.dir/depend.make

# Include the progress variables for this target.
include third-party/spdlog/CMakeFiles/spdlog.dir/progress.make

# Include the compile flags for this target's objects.
include third-party/spdlog/CMakeFiles/spdlog.dir/flags.make

third-party/spdlog/CMakeFiles/spdlog.dir/src/spdlog.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/spdlog.cpp.o: ../third-party/spdlog/src/spdlog.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/spdlog.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/spdlog.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/spdlog.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/spdlog.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/spdlog.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/spdlog.cpp > CMakeFiles/spdlog.dir/src/spdlog.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/spdlog.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/spdlog.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/spdlog.cpp -o CMakeFiles/spdlog.dir/src/spdlog.cpp.s

third-party/spdlog/CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.o: ../third-party/spdlog/src/stdout_sinks.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/stdout_sinks.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/stdout_sinks.cpp > CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/stdout_sinks.cpp -o CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.s

third-party/spdlog/CMakeFiles/spdlog.dir/src/color_sinks.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/color_sinks.cpp.o: ../third-party/spdlog/src/color_sinks.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/color_sinks.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/color_sinks.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/color_sinks.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/color_sinks.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/color_sinks.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/color_sinks.cpp > CMakeFiles/spdlog.dir/src/color_sinks.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/color_sinks.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/color_sinks.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/color_sinks.cpp -o CMakeFiles/spdlog.dir/src/color_sinks.cpp.s

third-party/spdlog/CMakeFiles/spdlog.dir/src/file_sinks.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/file_sinks.cpp.o: ../third-party/spdlog/src/file_sinks.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/file_sinks.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/file_sinks.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/file_sinks.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/file_sinks.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/file_sinks.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/file_sinks.cpp > CMakeFiles/spdlog.dir/src/file_sinks.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/file_sinks.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/file_sinks.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/file_sinks.cpp -o CMakeFiles/spdlog.dir/src/file_sinks.cpp.s

third-party/spdlog/CMakeFiles/spdlog.dir/src/async.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/async.cpp.o: ../third-party/spdlog/src/async.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/async.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/async.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/async.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/async.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/async.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/async.cpp > CMakeFiles/spdlog.dir/src/async.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/async.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/async.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/async.cpp -o CMakeFiles/spdlog.dir/src/async.cpp.s

third-party/spdlog/CMakeFiles/spdlog.dir/src/cfg.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/cfg.cpp.o: ../third-party/spdlog/src/cfg.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/cfg.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/cfg.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/cfg.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/cfg.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/cfg.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/cfg.cpp > CMakeFiles/spdlog.dir/src/cfg.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/cfg.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/cfg.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/cfg.cpp -o CMakeFiles/spdlog.dir/src/cfg.cpp.s

third-party/spdlog/CMakeFiles/spdlog.dir/src/fmt.cpp.o: third-party/spdlog/CMakeFiles/spdlog.dir/flags.make
third-party/spdlog/CMakeFiles/spdlog.dir/src/fmt.cpp.o: ../third-party/spdlog/src/fmt.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building CXX object third-party/spdlog/CMakeFiles/spdlog.dir/src/fmt.cpp.o"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/spdlog.dir/src/fmt.cpp.o -c /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/fmt.cpp

third-party/spdlog/CMakeFiles/spdlog.dir/src/fmt.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/spdlog.dir/src/fmt.cpp.i"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/fmt.cpp > CMakeFiles/spdlog.dir/src/fmt.cpp.i

third-party/spdlog/CMakeFiles/spdlog.dir/src/fmt.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/spdlog.dir/src/fmt.cpp.s"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog/src/fmt.cpp -o CMakeFiles/spdlog.dir/src/fmt.cpp.s

# Object files for target spdlog
spdlog_OBJECTS = \
"CMakeFiles/spdlog.dir/src/spdlog.cpp.o" \
"CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.o" \
"CMakeFiles/spdlog.dir/src/color_sinks.cpp.o" \
"CMakeFiles/spdlog.dir/src/file_sinks.cpp.o" \
"CMakeFiles/spdlog.dir/src/async.cpp.o" \
"CMakeFiles/spdlog.dir/src/cfg.cpp.o" \
"CMakeFiles/spdlog.dir/src/fmt.cpp.o"

# External object files for target spdlog
spdlog_EXTERNAL_OBJECTS =

third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/spdlog.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/stdout_sinks.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/color_sinks.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/file_sinks.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/async.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/cfg.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/src/fmt.cpp.o
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/build.make
third-party/spdlog/libspdlog.a: third-party/spdlog/CMakeFiles/spdlog.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_8) "Linking CXX static library libspdlog.a"
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && $(CMAKE_COMMAND) -P CMakeFiles/spdlog.dir/cmake_clean_target.cmake
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/spdlog.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
third-party/spdlog/CMakeFiles/spdlog.dir/build: third-party/spdlog/libspdlog.a

.PHONY : third-party/spdlog/CMakeFiles/spdlog.dir/build

third-party/spdlog/CMakeFiles/spdlog.dir/clean:
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog && $(CMAKE_COMMAND) -P CMakeFiles/spdlog.dir/cmake_clean.cmake
.PHONY : third-party/spdlog/CMakeFiles/spdlog.dir/clean

third-party/spdlog/CMakeFiles/spdlog.dir/depend:
	cd /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/ubuntu/Desktop/VRDAVis/vrdavis-backend /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/third-party/spdlog /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog /home/ubuntu/Desktop/VRDAVis/vrdavis-backend/build/third-party/spdlog/CMakeFiles/spdlog.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : third-party/spdlog/CMakeFiles/spdlog.dir/depend

