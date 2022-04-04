cmake_minimum_required(VERSION 3.10)
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

# Include uWebSockets headers and build the uSockets lib
include_directories(${CMAKE_SOURCE_DIR}/third-party/include)
install_uWebSockets()

set(LINK_LIBS
    ${LINK_LIBS}
    uSockets
    ${CMAKE_THREAD_LIBS_INIT})

set(SOURCE_FILES
    ${SOURCE_FILES}
    Main.cpp
    WebSocketServer.cpp
)

add_executable(vrdavis_backend ${SOURCE_FILES})