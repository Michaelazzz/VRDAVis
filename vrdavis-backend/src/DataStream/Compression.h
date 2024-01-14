#ifndef COMPRESSION_H_
#define COMPRESSION_H_

#include <vector>
#include <cstdint>

namespace vrdavis {

// int Compress(std::vector<float>& array, size_t offset, std::vector<char>& compression_buffer, std::size_t& compressed_size, uint32_t nx,uint32_t ny, uint32_t nz, uint32_t precision);
int Compress(float* array, std::vector<char>& compression_buffer, std::size_t& compressed_size, int nx, int ny, int nz, int precision);
// int Decompress(std::vector<float>& array, std::vector<char>& compression_buffer, int nx, int ny, int nz, int precision);
int Decompress(float* array, std::vector<char>& compression_buffer, int nx, int ny, int nz, int precision);

} // namespace vrdavis

#endif // COMPRESSION_H_