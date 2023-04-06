#ifndef FILEINFOLOADER_H_
#define FILEINFOLOADER_H_

#include <string>

#include <vrdavis-protobuf/file_info.pb.h>

namespace vrdavis {

class FileInfoLoader {
public:
    FileInfoLoader(const std::string& filename);
    FileInfoLoader(const std::string& filename, const VRDAVis::FileType& type);

    bool FillFileInfo(VRDAVis::FileInfo& file_info);
    bool FillFileExtInfo(VRDAVis::FileInfoExtended& extended_info, std::string& hdu, std::string& message);

private:
    VRDAVis::FileType GetCartaFileType(const std::string& filename);
    bool GetHdf5HduList(VRDAVis::FileInfo& file_info, const std::string& abs_filename);

    std::string _filename;
    VRDAVis::FileType _type;
};

} // namespace vrdavis

#endif // FILEINFOLOADER_H_
