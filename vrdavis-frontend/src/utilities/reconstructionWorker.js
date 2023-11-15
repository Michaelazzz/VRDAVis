const reconstructionWorker = () => {
    onmessage = function(e) {
        console.log('Worker: Message received from main script');
        const width = e.data[0];
        const height = e.data[1];
        const length =  e.data[2];
        const indexArr = e.data[3];
        const dataArr = e.data[4];
        const widthArr = e.data[5];
        const heightArr = e.data[6];
        const lengthArr = e.data[7];
        const CUBELET_SIZE_XY = e.data[8];
        const CUBELET_SIZE_Z = e.data[9];
        const rangeX = e.data[10];
        const rangeY = e.data[11];
        const rangeZ = e.data[12];

      
        const data = new Float32Array(width*height*length);
        console.log('Worker: reconstructing cube');
        for (let index = 0; index < indexArr.length; index++) {
            const coord = indexArr[index].split('_');
            // console.log(`coord ${coord[0]} ${coord[1]} ${coord[2]}`);
            // console.log(`cubelet ${widthArr[index]} ${heightArr[index]} ${lengthArr[index]}`);
            // add cubelet
            let n = 0;
            let translatedX = 0;
            if (coord[0] > 0) {
                if (rangeX[0] > 0 ) {
                    translatedX = coord[0] - (rangeX[1] - rangeX[0]);
                } else {
                    translatedX = coord[0] - rangeX[0];
                }
            }
            // console.log(`x ${translatedX} -> from ${translatedX*CUBELET_SIZE_XY} to ${(translatedX*CUBELET_SIZE_XY)+widthArr[index]}`);
            let translatedY = 0;
            if (coord[1] > 0) {
                if (rangeY[0] > 0 ) {
                    translatedY = coord[1] - (rangeY[1] - rangeY[0]);
                } else {
                    translatedY = coord[1] - rangeY[0];
                }
            }
            // console.log(`y ${translatedY} -> from ${translatedY*CUBELET_SIZE_XY} to ${(translatedY*CUBELET_SIZE_XY)+heightArr[index]}`);
            let translatedZ = 0;
            if (coord[2] > 0) {
                if (rangeZ[0] > 0 ) {
                    translatedZ = coord[2] - (rangeZ[1] - rangeZ[0]);
                } else {
                    translatedZ = coord[2] - rangeZ[0];
                }
            }
            // console.log(`z ${translatedZ} -> from ${translatedZ*CUBELET_SIZE_Z} to ${(translatedZ*CUBELET_SIZE_Z)+lengthArr[index]}`)
            for(let l = translatedZ*CUBELET_SIZE_Z; l < (translatedZ*CUBELET_SIZE_Z)+lengthArr[index]; l++) {
                for(let k = translatedY*CUBELET_SIZE_XY; k < (translatedY*CUBELET_SIZE_XY)+heightArr[index]; k++) {
                    for(let j = translatedX*CUBELET_SIZE_XY; j < (translatedX*CUBELET_SIZE_XY)+widthArr[index]; j++) {
                        const current = dataArr[index];
                        data[j + (k*width) + (l * width * height)] = current[n];
                        n++;
                    }
                }
            }
        }
      
        console.log('Worker: Posting data back to main script');
        postMessage(data);
    }
}

let code = reconstructionWorker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: 'application/javascriptssky' })
const workerScript = URL.createObjectURL(blob)
export { workerScript };