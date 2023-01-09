var chart;
importScripts("https://cdn.jsdelivr.net/npm/chart.js@3.8.0/dist/chart.min.js");

// Waiting to receive the OffScreenCanvas
onmessage = function(e) {
    if(e.data.canvas)
    {
        const {canvas, config} = e.data;
        chart = new Chart(canvas.getContext("2d"), config);

        canvas.width = 500;
        canvas.height = 250;
        chart.resize();

        chart.update();
    }

    sendCanvasData();
};

// send canvas data back to the main thread
sendCanvasData = function() {
    chart.canvas.convertToBlob().then(blob => {
        const dataURL = new FileReaderSync().readAsDataURL(blob);
        postMessage(dataURL);
    });
}