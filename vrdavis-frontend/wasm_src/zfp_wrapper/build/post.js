var ctx = self;
var FLT_MAX = 3.402823466e+38;
// Allocate a 4 MB uncompressed buffer and 1 MB uncompressed buffer
Module.nDataBytes = 4e6;
Module.nDataBytesCompressed = 1e6;
Module.dataPtr = null;
Module.dataHeap = null;
Module.resultFloat = null;
Module.dataPtrUint = null;
Module.dataHeapUint = null;
Module.debugOutput = false;
Module.id = -1;
var zfpDecompress = Module.cwrap("zfpDecompress", "number", ["number", "number", "number", "number", "number", "number", "number"]);
addOnPostRun(function () {
    // Allocate a 4 MB uncompressed buffer and 1 MB uncompressed buffer
    Module.nDataBytes = 4e6;
    Module.nDataBytesCompressed = 1e6;
    Module.dataPtr = Module._malloc(Module.nDataBytes);
    Module.dataHeap = new Uint8Array(Module.HEAPU8.buffer, Module.dataPtr, Module.nDataBytes);
    Module.resultFloat = new Float32Array(Module.dataHeap.buffer, Module.dataHeap.byteOffset, Module.nDataBytes / 4);
    Module.dataPtrUint = Module._malloc(Module.nDataBytesCompressed);
    Module.dataHeapUint = new Uint8Array(Module.HEAPU8.buffer, Module.dataPtrUint, Module.nDataBytesCompressed);
    ctx.postMessage(["ready"]);
});
Module.zfpDecompressUint8WASM = function (u8, compressedSize, nx, ny, nz, precision) {
    var newNumDataBytes = nx * ny * nz * 4;
    if (!Module.dataPtr || newNumDataBytes > Module.nDataBytes) {
        if (Module.dataHeap) {
            Module._free(Module.dataHeap.byteOffset);
        }
        Module.nDataBytes = newNumDataBytes;
        Module.dataPtr = Module._malloc(Module.nDataBytes);
        Module.dataHeap = new Uint8Array(Module.HEAPU8.buffer, Module.dataPtr, Module.nDataBytes);
        if (Module.debugOutput) {
            console.log("ZFP Worker ".concat(Module.id, " allocating new uncompressed buffer (").concat(Module.nDataBytes / 1000, " KB)"));
        }
        Module.resultFloat = new Float32Array(Module.dataHeap.buffer, Module.dataHeap.byteOffset, nx * ny * nz);
    }
    var newNumDataBytesCompressed = u8.length;
    if (!Module.dataPtrUint || newNumDataBytesCompressed > Module.nDataBytesCompressed) {
        if (Module.dataHeapUint) {
            Module._free(Module.dataHeapUint.byteOffset);
        }
        Module.nDataBytesCompressed = newNumDataBytesCompressed;
        Module.dataPtrUint = Module._malloc(Module.nDataBytesCompressed);
        Module.dataHeapUint = new Uint8Array(Module.HEAPU8.buffer, Module.dataPtrUint, Module.nDataBytesCompressed);
        if (Module.debugOutput) {
            console.log("ZFP Worker ".concat(Module.id, " allocating new compressed buffer (").concat(Module.nDataBytesCompressed / 1000, " KB)"));
        }
    }
    Module.dataHeapUint.set(new Uint8Array(u8.buffer, u8.byteOffset, compressedSize));
    // Call function and get result
    zfpDecompress(Math.floor(precision), Module.dataHeap.byteOffset, nx, ny, nz, Module.dataHeapUint.byteOffset, compressedSize);
    // Free memory
    return new Float32Array(Module.resultFloat.buffer, Module.resultFloat.byteOffset, nx * ny * nz);
    // END WASM
};
ctx.onmessage = (function (event) {
    if (event.data && Array.isArray(event.data) && event.data.length > 1) {
        var eventName = event.data[0];
        if (eventName === "debug") {
            Module.debugOutput = event.data[1];
        }
        if (eventName === "setid") {
            Module.id = event.data[1];
        }
        else if (eventName === "decompress") {
            var eventArgs = event.data[2];
            var compressedView = new Uint8Array(event.data[1], 0, eventArgs.size);
            // console.log('ZFP worker - compressed data');
            // console.log(compressedView);
            if (Module.debugOutput) {
                performance.mark("decompressStart");
            }
            var imageData = Module.zfpDecompressUint8WASM(compressedView, eventArgs.size, eventArgs.length, eventArgs.width, eventArgs.height, eventArgs.compression);
            if (Module.debugOutput) {
                performance.mark("decompressEnd");
            }
            var outputView = new Float32Array(event.data[1], 0, eventArgs.width * eventArgs.height * eventArgs.length);
            outputView.set(imageData);
            // put NaNs back into data
            // let decodedIndex = 0;
            // let fillVal = false;
            // for (let L of eventArgs.nanEncodings) {
            //     if (fillVal) {
            //         // Some shader compilers have trouble with NaN checks, so we instead use a dummy value of -FLT_MAX
            //         outputView.fill(-FLT_MAX, decodedIndex, decodedIndex + L);
            //     }
            //     fillVal = !fillVal;
            //     decodedIndex += L;
            // }
            // console.log('ZFP worker - decompressed data');
            // console.log(outputView);
            ctx.postMessage(["decompress", [event.data[1]], {
                    fileId: eventArgs.fileId,
                    width: eventArgs.width,
                    height: eventArgs.height,
                    length: eventArgs.length,
                    cubeletCoordinate: eventArgs.cubeletCoordinate,
                    layerXY: eventArgs.layerXY,
                    layerZ: eventArgs.layerZ,
                    requestId: eventArgs.requestId
                }], [event.data[1]]);
            if (Module.debugOutput) {
                performance.measure("dtDecompress", "decompressStart", "decompressEnd");
                var dt_1 = performance.getEntriesByName("dtDecompress")[0].duration;
                performance.clearMarks();
                performance.clearMeasures();
                var eventSize_1 = (4e-6 * eventArgs.width * eventArgs.height * eventArgs.length);
                setTimeout(function () {
                    console.log("ZFP Worker ".concat(Module.id, " decompressed ").concat(eventSize_1.toFixed(2), " MB in ").concat(dt_1.toFixed(2), " ms at ").concat((1e3 * eventSize_1 / dt_1).toFixed(2), " MB/s (").concat((1e3 * eventSize_1 / dt_1 / 4).toFixed(2), " Mpix/s)"));
                }, 100);
            }
        }
    }
});
module.exports = Module;
