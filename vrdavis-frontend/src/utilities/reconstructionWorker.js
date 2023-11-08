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
      
        const data = new Float32Array(width*height*length);
      
        console.log('Worker: reconstructing cube');
      
        for (let index = 0; index < indexArr.length; index++) {
            const coord = indexArr[index].split('_');
            console.log('cubelet');
            // add cubelet
            let n = 0;
            for(let l = lengthArr[index]*Number(coord[2]); l < lengthArr[index]*Number(coord[2])+lengthArr[index]; l++) {
                for(let k = heightArr[index]*Number(coord[1]); k < heightArr[index]*Number(coord[1])+heightArr[index]; k++) {
                    for(let j = widthArr[index]*Number(coord[0]); j < widthArr[index]*Number(coord[0])+widthArr[index]; j++) {
                        const current = dataArr[index];
                        data[j + (k*width) + (l * width * height)] = current[n];
                        n++;
                    }
                }
            }
        }
      
        console.log('Worker: Posting message back to main script');
        postMessage(data);
    }
}

let code = reconstructionWorker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: 'application/javascriptssky' })
const workerScript = URL.createObjectURL(blob)
export { workerScript };