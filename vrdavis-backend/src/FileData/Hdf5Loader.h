#ifndef HDF5LOADER_H_
#define HDF5LOADER_H_

#include <H5Cpp.h>
#include <hdf5.h>
// #include <highfive/H5File.hpp>
#include <mutex>
#include <vector>
#include <memory>

namespace vrdavis {

class Hdf5Loader {
public:
    // Hdf5Loader(const std::string& filename, const std::string& directory, const std::string& dataset);
    Hdf5Loader();
    virtual ~Hdf5Loader();

    void OpenFile(const std::string& filename, const std::string& directory, const std::string& dataset);

    // bool ReadData(std::shared_ptr<std::vector<float>>& volume_data_out);
    bool ReadData(float* volume_data_out);
    bool ReadAllData(float* volume_data_out);

    int getXDimensions();
    int getYDimensions();
    int getZDimensions();

    // void ReadData(float* data_out, int X, int Y, int Z, int Xoffset, int Yoffset, int Zoffset);

    // virtual bool GetChunk(std::vector<float>& data, int& data_width, int& data_height, int min_x, int min_y, int z, int stokes, std::mutex& image_mutex);

    std::string GetFileName();
    std::string GetDirectory();
    std::string GetDatasetName();

    void Closefile();

protected:
    std::string _filename, _directory, _dataset;

private:
    hid_t _filespace;
    hid_t file_id, dataset_id, dataspace_id;
    H5::DataType _type;
    H5::H5File _file;
    H5::DataSet _set;
    H5::DataSpace _space;
    int _NX, _NZ, _NY;
    hid_t _memspace;
    hsize_t _rank;
};

} // namespace vrdavis

#endif // HDF5LOADER_H_