#ifndef FILELOADER_H_
#define FILELOADER_H_

#include <H5Cpp.h>

namespace vrdavis {

class FileLoader
{
public:
    FileLoader() {}
    ~FileLoader();

    void OpenFile(const std::string& filename, const std::string& directory, const std::string& dataset);

protected:
    std::string _filename;
    std::string _directory;
private:
    hid_t _filespace;
    double* _data;
    H5::DataType _type;
    H5::H5File _file;
    H5::DataSet _set;
    H5::DataSpace _space;
    int _NX, _NY, _NZ;
    hid_t _memspace;
    int _XY, _Z;
};


} // namespace vrdavis

#endif // FILELOADER_H_