#ifndef CUBELET_H_
#define CUBELET_H_

#include <cmath>
#include <cstdint>
#include <iostream>
#include <string>
#include <cstring>

namespace vrdavis {

struct Cubelet {

    int64_t x;
    int64_t y;
    int64_t z;
    int64_t mipXY;
    int64_t mipZ;

    static std::string Encode(int64_t x, int64_t y, int64_t z, int64_t mipXY, int64_t mipZ) {
        return (std::to_string(x) + "_" + std::to_string(y) + "_" + std::to_string(z) + "_" + std::to_string(mipXY) + "_" + std::to_string(mipZ));
    }

    static Cubelet Decode(std::string encoded_value) {
        const int length = encoded_value.length();
        char* str = new char[length + 1];
        strcpy(str, encoded_value.c_str());

        char *token = strtok(str, "_");

        int64_t x = *token - 48;
        token = strtok(NULL, "_");
        int64_t y = *token - 48;
        token = strtok(NULL, "_");
        int64_t z = *token - 48;
        token = strtok(NULL, "_");
        int64_t mipXY = *token - 48;
        token = strtok(NULL, "_");
        int64_t mipZ = *token - 48;
        token = strtok(NULL, "_");

        return Cubelet{x, y, z, mipXY, mipZ};
    }

    static int64_t LayerToMip(int64_t layer, int64_t image_width, int64_t image_height, int64_t image_length, int64_t tile_width, int64_t tile_height, int64_t tile_length) {
        double total_tiles_x = ceil((double)(image_width) / tile_width);
        double total_tiles_y = ceil((double)(image_height) / tile_height);
        double total_tiles_z = ceil((double)(image_length) / tile_length);
        double max_mip = std::max(total_tiles_x, total_tiles_y);
        double total_layers = ceil(log2(max_mip));
        return pow(2.0, total_layers - layer);
    }

    static int64_t MipToLayer(int64_t mip, int64_t image_width, int64_t image_height, int64_t tile_width, int64_t tile_height) {
        double total_tiles_x = ceil((double)(image_width) / tile_width);
        double total_tiles_y = ceil((double)(image_height) / tile_height);
        double max_mip = std::max(total_tiles_x, total_tiles_y);
        return ceil(log2(max_mip / mip));
    }

};

} // namespace vrdavis

#endif // CUBELET_H_
