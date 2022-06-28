cmake_minimum_required(VERSION 3.16.3)
project(vrdavis_backend VERSION 1.0)

include_directories(src)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_INCLUDE_DIRECTORIES_BEFORE ON)
set(CMAKE_LINK_DIRECTORIES_BEFORE ON)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "RelWithDebInfo")
endif()

set(CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/third-party/install)

include(uWebSockets)

find_package(OpenMP)
if (OPENMP_CXX_FOUND)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
else ()
    message(WARNING "OpenMP not found!")
endif ()

FIND_PACKAGE(CURL REQUIRED)
FIND_PACKAGE(ZFP CONFIG REQUIRED)
FIND_PACKAGE(PkgConfig REQUIRED)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
FIND_PACKAGE(Threads)
set(LINK_LIBS ${LINK_LIBS} stdc++fs)

if (${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    SET(CMAKE_C_ARCHIVE_CREATE "<CMAKE_AR> Scr <TARGET> <LINK_FLAGS> <OBJECTS>")
    SET(CMAKE_CXX_ARCHIVE_CREATE "<CMAKE_AR> Scr <TARGET> <LINK_FLAGS> <OBJECTS>")
    SET(CMAKE_C_ARCHIVE_FINISH "<CMAKE_RANLIB> -no_warning_for_no_symbols -c <TARGET>")
    SET(CMAKE_CXX_ARCHIVE_FINISH "<CMAKE_RANLIB> -no_warning_for_no_symbols -c <TARGET>")
    INCLUDE_DIRECTORIES(/usr/local/include)
    INCLUDE_DIRECTORIES(/usr/local/opt/openssl/include)
    INCLUDE_DIRECTORIES(/usr/local/opt/libomp/include)
    LINK_DIRECTORIES(/usr/local/lib)
    LINK_DIRECTORIES(/usr/local/opt)
    LINK_DIRECTORIES(/opt/homebrew/lib)
endif (${CMAKE_SYSTEM_NAME} MATCHES "Darwin")

if (DisableContourCompression)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -D_DISABLE_CONTOUR_COMPRESSION_")
endif (DisableContourCompression)

if (CMAKE_CXX_COMPILER_ID MATCHES "GNU" AND CMAKE_CXX_COMPILER_VERSION LESS 11.2.0)
    set(LINK_LIBS ${LINK_LIBS} stdc++fs)
endif ()


# Include uWebSockets headers and build the uSockets lib
include_directories(${CMAKE_SOURCE_DIR}/third-party/include)
install_uWebSockets()
add_subdirectory(third-party/spdlog)

find_package(OpenMP)
if (OPENMP_FOUND)
    set (CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${OpenMP_C_FLAGS}")
    set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
    set (CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${OpenMP_EXE_LINKER_FLAGS}")
    set(LINK_LIBS ${LINK_LIBS} ${OpenMP_CXX_LIBRARIES})
endif ()

set(ZFP_DIR ${CMAKE_SOURCE_DIR}/third-party/zfp)
find_package(ZFP REQUIRED)
if (ZFP_FOUND)
    include_directories(${ZFP_INCLUDE_DIR})
    set(LINK_LIBS ${LINK_LIBS} ${ZFP_LIBRARIES})
else ()
    message(FATAL_ERROR "Could not find ZFP.")
endif ()

set(LINK_LIBS
    ${LINK_LIBS}
    uSockets
    z
    ${OpenMP_CXX_LIBRARIES}
    ${CMAKE_THREAD_LIBS_INIT}
)

set(SOURCE_FILES
    ${SOURCE_FILES}
    src/HttpServer.cpp
    src/Main.cpp
    src/Session.cpp
    src/SessionManager.cpp
)

add_executable(vrdavis_backend ${SOURCE_FILES})
target_compile_options(vrdavis_backend PUBLIC ${vrdavis_backend_CFLAGS})
target_link_libraries(vrdavis_backend ${LINK_LIBS})