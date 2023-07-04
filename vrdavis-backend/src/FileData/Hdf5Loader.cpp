#include "Hdf5Loader.h"

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sys/stat.h>
#include <spdlog/spdlog.h>

using namespace vrdavis;

Hdf5Loader::Hdf5Loader() {}

Hdf5Loader::~Hdf5Loader() {}

void Hdf5Loader::OpenFile(const std::string& filename, const std::string& directory, const std::string& dataset) {
    _filename = filename;
    _directory = directory;
    _dataset = dataset; // dataset name -> 0/DATA
    std::string path = _directory + "/" + _filename;
    // std::string path = "../../test-data/WFPC2u5780205r_c0fx.hdf5";
    try {
        // open file
        file_id = H5Fopen(path.c_str(), H5F_ACC_RDONLY, H5P_DEFAULT);
        // open dataset
        dataset_id = H5Dopen2(file_id, _dataset.c_str(), H5P_DEFAULT);
        // get dataspace of the dataset
        dataspace_id = H5Dget_space(dataset_id);

        hsize_t dims_out[3];
        // number of dimensions in the file
        H5Sget_simple_extent_dims(dataspace_id, dims_out, NULL);
        // std::cout << "dimensions " << (unsigned long)(dims_out[0]) << " x " << (unsigned long)(dims_out[1]) << " x " << (unsigned long)(dims_out[2]) <<  std::endl;

        _NZ = dims_out[0];
        _NY = dims_out[1];
        _NX = dims_out[2];
    } catch (H5::FileIException &file_exists_err) {
        spdlog::error(file_exists_err.getDetailMsg());
    } catch( H5::DataSetIException &dataset_exists_err ) {
        spdlog::error(dataset_exists_err.getDetailMsg());
    } catch( H5::DataTypeIException &error ) {
        spdlog::error(error.getDetailMsg());
    }
}

void Hdf5Loader::OpenFileAlternative(const std::string& filename, const std::string& directory, const std::string& dataset) {
    _filename = filename;
    _directory = directory;
    _dataset = dataset; // dataset name -> 0/DATA
    std::string path = _directory + "/" + _filename;
    // std::string path = "../../test-data/WFPC2u5780205r_c0fx.hdf5";
    try {
        // open file
        _file = H5Fopen(path.c_str(), H5F_ACC_RDONLY, H5P_DEFAULT);
        // open dataset
        _set = _file.openDataSet(_dataset.c_str());
        // get dataspace of the dataset
        _space = _set.getSpace();
        _filespace = H5Dget_space(_set.getId());

        hsize_t dims_out[3];
        // number of dimensions in the file
        H5Sget_simple_extent_dims(dataspace_id, dims_out, NULL);
        // std::cout << "dimensions " << (unsigned long)(dims_out[0]) << " x " << (unsigned long)(dims_out[1]) << " x " << (unsigned long)(dims_out[2]) <<  std::endl;

        _NZ = dims_out[0];
        _NY = dims_out[1];
        _NX = dims_out[2];
    } catch (H5::FileIException &file_exists_err) {
        spdlog::error(file_exists_err.getDetailMsg());
    } catch( H5::DataSetIException &dataset_exists_err ) {
        spdlog::error(dataset_exists_err.getDetailMsg());
    } catch( H5::DataTypeIException &error ) {
        spdlog::error(error.getDetailMsg());
    }
}

// bool Hdf5Loader::ReadData(std::shared_ptr<std::vector<float>>& volume_data_out) {

bool Hdf5Loader::ReadAllData(float* volume_data_out) {
    try {
        // read all the data in the dataset
        H5Dread(dataset_id, H5T_NATIVE_FLOAT, H5S_ALL, H5S_ALL, H5P_DEFAULT, volume_data_out);
    } catch( H5::FileIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    } catch (H5::DataSetIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    } catch( H5::DataTypeIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    }
    return true;
}

int Hdf5Loader::getXDimensions() {
    return _NX;
}

int Hdf5Loader::getYDimensions() {
    return _NY;
}

int Hdf5Loader::getZDimensions() {
    return _NZ;
}

bool Hdf5Loader::GetChunk(float* volume_data_out, int chunk_width, int chunk_height, int chunk_depth, int xOffset, int yOffset, int zOffset) {
    try {

        hsize_t offset[3]; // starting positions of the hyperslab
        offset[2] = xOffset;
        offset[1] = yOffset;
        offset[0] = zOffset;

        // spdlog::info("Dims: {} {} {}", _NX, _NY, _NZ);
        spdlog::info("Offset: {} {} {}", xOffset, yOffset, zOffset);
        
        hsize_t chunk_dims[3]; // number of elements to read
        chunk_dims[2] = chunk_width;
        chunk_dims[1] = chunk_height;
        chunk_dims[0] = chunk_depth;

        // spdlog::info("Chunk Size: {} {} {}", chunk_width, chunk_height, chunk_depth);

        hid_t memspace_id = H5Screate_simple(3, chunk_dims, NULL);
        // H5Sselect_hyperslab(_memspace, H5S_SELECT_SET, offset, NULL, chunk_dims, NULL);
        H5Sselect_hyperslab(dataspace_id, H5S_SELECT_SET, offset, NULL, chunk_dims, NULL);

        H5Dread(dataset_id, H5T_NATIVE_FLOAT, memspace_id, dataspace_id, H5P_DEFAULT, volume_data_out);

    } catch( H5::FileIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    } catch (H5::DataSetIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    } catch( H5::DataTypeIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    }
    return true;
}

bool Hdf5Loader::GetChunkAlternative(float* volume_data_out, int chunk_width, int chunk_height, int chunk_depth, int xOffset, int yOffset, int zOffset) {
    try {

        /*
        * Define hyperslab in the dataset; implicitly giving strike and
        * block NULL.
        */
        hsize_t      offset[3];   // hyperslab offset in the file
        hsize_t      count[3];    // size of the hyperslab in the file
        offset[0] = zOffset;
        offset[1] = yOffset;
        offset[2] = xOffset;
        count[0]  = chunk_width;
        count[1]  = chunk_height;
        count[2]  = chunk_depth;
        _space.selectHyperslab( H5S_SELECT_SET, count, offset );
        /*
        * Define the memory dataspace.
        */
        hsize_t     dimsm[3];              /* memory space dimensions */
        dimsm[0] = chunk_width;
        dimsm[1] = chunk_height;
        dimsm[2] = chunk_depth ;
        H5::DataSpace memspace( 3, dimsm );
        /*
        * Define memory hyperslab.
        */
        hsize_t      offset_out[3];       // hyperslab offset in memory
        hsize_t      count_out[3];        // size of the hyperslab in memory
        offset_out[0] = 0;
        offset_out[1] = 0;
        offset_out[2] = 0;
        count_out[0]  = chunk_width;
        count_out[1]  = chunk_height;
        count_out[2]  = chunk_depth;
        memspace.selectHyperslab( H5S_SELECT_SET, count_out, offset_out );
        /*
        * Read data from hyperslab in the file into the hyperslab in
        * memory and display the data.
        */
        _set.read( volume_data_out, H5T_NATIVE_FLOAT, memspace, _space );

    } catch( H5::FileIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    } catch (H5::DataSetIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    } catch( H5::DataTypeIException &error ) {
        spdlog::error(error.getDetailMsg());
        return false;
    }
    return true;
}

std::string Hdf5Loader::GetFileName() {
    return _filename;
}

std::string Hdf5Loader::GetDirectory() {
    return _directory;
}

std::string Hdf5Loader::GetDatasetName() {
    return _dataset;
}

void Hdf5Loader::Closefile()
{
    // H5Sclose(_memspace);
    H5Sclose(dataspace_id);
    H5Dclose(dataset_id);
    H5Fclose(file_id);
}

