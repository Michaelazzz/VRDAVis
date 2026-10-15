# VRDAVis
[![DOI](https://zenodo.org/badge/508310388.svg)](https://doi.org/10.5281/zenodo.23396170)
This is a full‑stack prototype for interactive radio‑astronomy data visualisation (C/C++ backend, React + TypeScript frontend) that uses protobufs for the client/server protocol — intended as a proof‑of‑concept for CARTAvis.

## Stack
Language(s): C++ (backend), C (some parts), TypeScript/JavaScript (frontend), Make/CMake, WebAssembly artifacts in frontend
Framework / runtime: C++ server built with CMake; frontend bootstrapped with Create React App (TypeScript)
Notable libraries & dependencies: Protobuf (protobuf-generated messages / RPC), HDF5 (data IO), uWebSockets (HTTP / socket server), zfp (compression), spdlog (logging). The backend CMake also references GSL, OpenMP and z/lib.

## How it's organized

Top-level entries (important ones):
- README.md — high level instructions
- vrdavis-backend/ — C++ server source, CMake build
- vrdavis-frontend/ — React + TypeScript UI, wasm helpers
- vrdavis-protobuf/ — .proto files and build script
- vrdavis-signalling-server/ — signalling server (separate component)
- .gitmodules

Annotated tree:
```
vrdavis-backend/
  CMakeLists.txt              CMake build manifest (links protobuf, HDF5, uWebSockets, zfp, spdlog)
  src/
    Main.cpp                  server entry point: sets up ProgramSettings, ThreadManager, SessionManager, HttpServer
    FileList/                 file listing handler used by sessions
    HttpServer/               HTTP/websocket server implementation (uWebSockets-backed)
    Session/                  Session, SessionManager, OnMessageTask (core app runtime)
    ThreadingManager/         thread pool / event thread management
    DataStream/ FileData/     data loading & compression (HDF5 loader, compression, cubelets)
    Logger/                   logging wrappers (spdlog usage)
    Util/                     utility helpers
  third-party/                vendored/build helpers (uWebSockets, spdlog, etc.)
  vrdavis-protobuf -> symlink to top-level protobuf submodule

vrdavis-frontend/
  package.json                Create React App + TypeScript project manifest
  src/
    index.tsx, App.tsx        React entry + app component
    components/, stores/      UI components and state stores
    shaders/                  WebGL / shader code used in visualisation
    wasm_src/ wasm_libs/      WebAssembly sources and output libraries (scripts provided to build)
  build_wasm_*_docker.sh      helper scripts to build wasm libs/wrappers in Docker
  protobuf/                   generated JS/TS protobuf bindings (or place for them)

vrdavis-protobuf/
  build_proto.sh              script to compile .proto files for client and C++ backend
  control/, request/, shared/, stream/   .proto groupings for different message sets

vrdavis-signalling-server/
  (signalling server implementation — separate component to coordinate peers sessions)
```

How it fits together:
The backend is a standalone C++ server (vrdavis_backend) built with CMake. Main.cpp creates a ProgramSettings instance, starts ThreadManager event threads, creates a FileListHandler and SessionManager, and runs the application loop. The HttpServer module exposes the network interface (uWebSockets) used by the frontend to exchange protobuf messages. The protobuf package defines the message schema shared by frontend and backend. The frontend is a Create React App TypeScript application that renders the visualisation, uses WebAssembly helpers for performance, and communicates with the backend through the protobuf-defined messages (via the signalling server / HTTP/socket endpoints).

## How to run it

Shortest path from a fresh clone to start both sides (as described in README):

1. Initialise submodules (backend expects third-party libs & protobuf as submodules)
```
git submodule update --init --recursive
```
2. Build and run the backend (run from vrdavis-backend/)
```
cd vrdavis-backend
mkdir build
cd build
cmake ..
make
./vrdavis_backend
```

Notes: CMakeLists finds Protobuf, HDF5, zfp, GSL and builds/link requirements; ensure those system packages (or the third-party installs) are available. Ubuntu 20.04 is the development OS.

3. Install and run the frontend (run from vrdavis-frontend/)
```
cd vrdavis-frontend
npm install
npm start
```
- The frontend is a Create React App; open http://localhost:3000 to view.
- There are helper scripts to build wasm libraries (build_wasm_libs_docker.sh and build_wasm_wrappers_docker.sh) if WebAssembly components are required.

If you need to regenerate protobuf bindings, run the build script in vrdavis-protobuf/:
```
cd vrdavis-protobuf
./build_proto.sh
```

(That script packages and generates language bindings used by both backend and frontend.)
