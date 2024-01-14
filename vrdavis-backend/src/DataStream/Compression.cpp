#include "Compression.h"

#include <array>
#include <cmath>

#include <zfp.h>

#ifdef _ARM_ARCH_
#include <sse2neon/sse2neon.h>
#else
#include <x86intrin.h>
#endif

namespace vrdavis {

int Compress(float* array, std::vector<char>& compression_buffer, std::size_t& compressed_size, int nx, int ny, int nz, int precision) {
    int status = 0;     /* return value: 0 = success */
    zfp_type type;      /* array scalar type */
    zfp_field* field;   /* array meta data */
    zfp_stream* zfp;    /* compressed stream */
    size_t buffer_size; /* byte size of compressed buffer */
    bitstream* stream;  /* bit stream to write to or read from */

    type = zfp_type_float;
    field = zfp_field_1d((void*)array, type, nx * ny * nz);

    /* allocate meta data for a compressed stream */
    zfp = zfp_stream_open(nullptr);

    /* set compression mode and parameters via one of three functions */
    zfp_stream_set_precision(zfp, precision);

    /* allocate buffer for compressed data */
    buffer_size = zfp_stream_maximum_size(zfp, field);
    if (compression_buffer.size() < buffer_size) {
        compression_buffer.resize(buffer_size);
    }
    stream = stream_open(compression_buffer.data(), buffer_size);
    zfp_stream_set_bit_stream(zfp, stream);
    zfp_stream_rewind(zfp);

    compressed_size = zfp_compress(zfp, field);
    if (!compressed_size) {
        status = 1;
    }

    /* clean up */
    zfp_field_free(field);
    zfp_stream_close(zfp);
    stream_close(stream);

    return status;
}

int Decompress(float* array, std::vector<char>& compression_buffer, int nx, int ny, int nz, int precision) {
    int status = 0;    /* return value: 0 = success */
    zfp_type type;     /* array scalar type */
    zfp_field* field;  /* array meta data */
    zfp_stream* zfp;   /* compressed stream */
    bitstream* stream; /* bit stream to write to or read from */
    type = zfp_type_float;
    // array.resize(size); // resize the resulting data
    field = zfp_field_1d((void*)array, type, nx * ny * nz);
    zfp = zfp_stream_open(NULL);

    zfp_stream_set_precision(zfp, precision);
    stream = stream_open(compression_buffer.data(), compression_buffer.size());
    zfp_stream_set_bit_stream(zfp, stream);
    zfp_stream_rewind(zfp);

    if (!zfp_decompress(zfp, field)) {
        status = 1;
    }

    zfp_field_free(field);
    zfp_stream_close(zfp);
    stream_close(stream);

    return status;
}

} // namespace vrdavis