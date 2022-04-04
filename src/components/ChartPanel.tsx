import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
  
ChartJS.register(ArcElement, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ChartPanel = () => {

    const ref = useRef()

    var canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 400

    var ctx = canvas.getContext('2d')

    const loader = new THREE.TextureLoader();

    useEffect(() => {
        // draw on canvas
        if(ctx) {

            // red square for testing
            // ctx.fillStyle = '#f00'
            // ctx.fillRect(20,10,80,50)

            // chart.js
            const chart = new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })

            console.log(chart)

            // console.log(canvas)

            var dataURL = canvas.toDataURL()

            if(ref)
            {
                loader.load(dataURL, (texture) => {
                    // @ts-ignore 
                    ref.current.set({ backgroundTexture: texture });
                });
            }
        }
    })
    
    

    return (
        <block
            ref={ref}
            args={[
                {
                width: 1,
                height: 1,
                fontSize: 0.1,
                backgroundOpacity: 1,
                fontFamily: './Roboto-msdf.json',
                fontTexture: './Roboto-msdf.png',
                }
            ]}></block>
    )
}

export default ChartPanel