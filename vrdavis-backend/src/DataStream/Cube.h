#ifndef CUBE_H_
#define CUBE_H_

#include <cmath>
#include <cstdint>
#include <iostream>

namespace vrdavis {

struct Cube {

    int32_t x;
    int32_t y;
    int32_t z;
    int32_t layer;

    static int32_t Encode(int32_t x, int32_t y, int32_t z, int32_t layer) {
        int32_t layer_width = 1 << layer;
        if (x < 0 || y < 0 || z < 0 || layer < 0 || layer > 12 || x >= layer_width || y >= layer_width || z >= layer_width) {
            return -1;
        }

        return ((layer << 24) | (y << 12) | x);
    }

    static Cube Decode(int32_t encoded_value) {
        int32_t x = (((encoded_value << 19) >> 19) + 4096) % 4096;
        int32_t layer = ((encoded_value >> 24) + 128) % 128;
        int32_t y = (((encoded_value << 7) >> 19) + 4096) % 4096;
        // int32_t z = (((encoded_value << 7) >> 19) + 4096) % 4096;
        return Cube{x, y, layer};
    }

    static int32_t LayerToMip(int32_t layer, int32_t image_width, int32_t image_height, int32_t image_length, int32_t tile_width, int32_t tile_height, int32_t tile_length) {
        double total_tiles_x = ceil((double)(image_width) / tile_width);
        double total_tiles_y = ceil((double)(image_height) / tile_height);
        double total_tiles_z = ceil((double)(image_length) / tile_length);
        double max_mip = std::max(total_tiles_x, total_tiles_y);
        double total_layers = ceil(log2(max_mip));
        return pow(2.0, total_layers - layer);
    }

    static int32_t MipToLayer(int32_t mip, int32_t image_width, int32_t image_height, int32_t tile_width, int32_t tile_height) {
        double total_tiles_x = ceil((double)(image_width) / tile_width);
        double total_tiles_y = ceil((double)(image_height) / tile_height);
        double max_mip = std::max(total_tiles_x, total_tiles_y);
        return ceil(log2(max_mip / mip));
    }
};

} // namespace vrdavis

#endif // CUBE_H_
