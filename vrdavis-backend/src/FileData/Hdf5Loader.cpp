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

// bool Hdf5Loader::ReadData(std::shared_ptr<std::vector<float>>& volume_data_out) {
bool Hdf5Loader::ReadData(float* volume_data_out) {
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

// bool Hdf5Loader::GetChunk(vector<float>& data, int& data_width, int& data_height, int min_x, int min_y, int z, int stokes, std::mutex& image_mutex) {
    // Must be implemented in subclasses
    // return false;
// }

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
    H5Sclose(dataspace_id);
    H5Dclose(dataset_id);
    H5Fclose(file_id);
}

