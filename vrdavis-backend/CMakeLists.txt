cmake_minimum_required(VERSION 3.16.3)
project(vrdavis_backend)

include_directories(src)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_INCLUDE_DIRECTORIES_BEFORE ON)
set(CMAKE_LINK_DIRECTORIES_BEFORE ON)

set(CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/third-party/install)

include(uWebSockets)

# Enable OpenMP if package is found
find_package(OpenMP)
if (OPENMP_CXX_FOUND)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
else ()
    message(WARNING "OpenMP not found!")
endif ()

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

FIND_PACKAGE(GSL REQUIRED)
FIND_PACKAGE(ZFP CONFIG REQUIRED)
FIND_PACKAGE(PkgConfig REQUIRED)

FIND_PACKAGE(Protobuf REQUIRED)
INCLUDE_DIRECTORIES(${PROTOBUF_INCLUDE_DIR})
FIND_PACKAGE(Threads)

ADD_SUBDIRECTORY(vrdavis-protobuf)
INCLUDE_DIRECTORIES(${CMAKE_CURRENT_BINARY_DIR})

if (CMAKE_CXX_COMPILER_ID MATCHES "GNU" AND CMAKE_CXX_COMPILER_VERSION LESS 11.2.0)
    set(LINK_LIBS ${LINK_LIBS} stdc++fs)
endif ()

# Include uWebSockets headers and build the uSockets lib
include_directories(${CMAKE_SOURCE_DIR}/third-party/include)
install_uWebSockets()
add_subdirectory(third-party/spdlog)

set(LINK_LIBS
    ${LINK_LIBS}
    vrdavis-protobuf
    ${PROTOBUF_LIBRARY}
    uSockets
    z
    ${OpenMP_CXX_LIBRARIES}
    ${CMAKE_THREAD_LIBS_INIT}
)

set(SOURCE_FILES
    ${SOURCE_FILES}
    src/HttpServer.cpp
    src/Main.cpp
    src/Message.cpp
    src/Session.cpp
    src/SessionManager.cpp
)

add_executable(vrdavis_backend ${SOURCE_FILES})
if (${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    list(REMOVE_ITEM LINK_LIBS uuid)
    target_link_libraries(vrdavis_backend uv ${LINK_LIBS})
endif (${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
if (${CMAKE_SYSTEM_NAME} MATCHES "Linux")
    target_link_libraries(vrdavis_backend ${LINK_LIBS})
endif (${CMAKE_SYSTEM_NAME} MATCHES "Linux")