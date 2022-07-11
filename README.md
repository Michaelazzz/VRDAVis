# VRDAVis
The current operating system used for the development environemnt of VRDAVis is Ubuntu 20.04.
The quirks of developing and running VRDAVis on other operating systems are not yet known.
## VRDAVis Backend
To build and run the VRDAVis backend all commands should be run from the "vrdavis-backend" folder.
### How to build the server
#### Add submodules
```
git submodule update --init --recursive
```
#### Build the backend
```
mkdir build
cd build
cmake ..
make
```
### How to run the server
```
./vrdavis_backend
```
## VRDAVis Frontend
To install the necessary packages and run the frontend all commands must be run from the "vradvis-frontend" folder.
### Install npm packages
```
npm install
```
### Run the React application
```
npm start
```
