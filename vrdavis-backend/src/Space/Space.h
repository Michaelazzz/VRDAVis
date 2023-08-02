#ifndef SPACE_H_
#define SPACE_H_

#include <algorithm>
#include <atomic>
#include <memory>
#include <mutex>
#include <shared_mutex>
#include <unordered_map>

#include "FileData/FileLoader.h"

namespace vrdavis {

class Space {
public:
    // Load image cache for default_z, except for PV preview image which needs cube
    Space(uint32_t session_id, std::shared_ptr<FileLoader> loader, const std::string& hdu, int default_z = DEFAULT_Z, bool load_image_cache = true);
    ~Space(){};

    size_t Width();     // length of x axis
    size_t Height();    // length of y axis
    size_t Depth();     // length of z axis

    // Raster data
    bool FillRasterTileData(CARTA::RasterTileData& raster_tile_data, const Tile& tile, int z, int stokes, CARTA::CompressionType compression_type, float compression_quality);
};

} // namespace vrdavis

#endif // SPACE_H_