import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";

import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, BasePlatform } from "chart.js";
import { useController, useInteraction, useXR, useXRFrame } from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title);

const ChartPanel = ({data}: any) => {
    const ref = useRef<Object3D>();

    const { gl, scene } = useThree();
    let referenceSpace = gl.xr.getReferenceSpace();

    let hover = false;

    const rightController = useController("right");

    const loader = new THREE.TextureLoader();

    var canvas = document.createElement("canvas");
    // var ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 250;
    let localCoord = new Vector2(0,0);
    
    let chart: Chart
    
    const raycaster = new Raycaster();
    let localPos = new Vector3(0,0,0);

    const geometry = new THREE.SphereGeometry( 0.01, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    

    // canvas.addEventListener("mouseenter", (e) => {
    //     console.log(e);
    // });

    useEffect(() => {
        // draw on canvas
        // if (ctx)

        chart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: ["Red", "Orage", "Yellow", "Green", "Blue", "Purple", "Grey"],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                      'rgb(255, 99, 132)',
                      'rgb(255, 159, 64)',
                      'rgb(255, 205, 86)',
                      'rgb(75, 192, 192)',
                      'rgb(54, 162, 235)',
                      'rgb(153, 102, 255)',
                      'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                layout: {
                    padding: 30
                },
                responsive: false,
                animation: {
                    duration: 0
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'rgb(255, 99, 132)'
                        }
                    }
                },
                onClick: (e) => {
                    // console.log(e);
                    chart.update();
                },
                onHover: (e) => {
                    // console.log(e);
                    chart.update();
                },
                events: ['mousemove', 'click']
            }
        });

        chart.update();
        
        loader.load(chart.toBase64Image(), texture => {
            // @ts-ignore
            ref.current.set({backgroundTexture: texture});
        });
        scene.add( sphere );
    });


    useXRFrame((time, xFrame) => {

        chart.update();

        if(hover)
        {
            const event = new MouseEvent('mousemove', {
                clientX: localCoord.x,
                clientY: localCoord.y
            });
    
            chart.canvas.dispatchEvent(event);
        }

        if (!ref.current) 
            return;

        loader.load(chart.toBase64Image(), texture => {
            // @ts-ignore
            ref.current.set({backgroundTexture: texture});
        });

        if(!hover || !rightController || !referenceSpace ) 
            return;
        
        let targetRayPose = xFrame.getPose(rightController.inputSource.targetRaySpace, referenceSpace); // transform corresponding to the target ray pose
        let targetRayOrigin = new Vector3(targetRayPose?.transform.position.x, targetRayPose?.transform.position.y, targetRayPose?.transform.position.z); // origin point of the ray, at the front of the controller
        let targetRayVector = new Vector3(targetRayPose?.transform.orientation.x, targetRayPose?.transform.orientation.y, targetRayPose?.transform.orientation.z); // direction the ray is pointing
        // targetRayVector.add(new Vector3(0,0,-1));

        raycaster.set(targetRayOrigin, targetRayVector);
    
        let intersection = raycaster.intersectObject(ref.current as Object3D);

        if(!intersection[0])
        {
            sphere.position.copy(targetRayOrigin);
            return;
        }
            
        sphere.position.copy(intersection[0].point);
        localPos.copy(ref.current.clone().worldToLocal(intersection[0].point)); // converts point in world space to local space
        localCoord.setX(canvas.height*localPos.x);
        localCoord.setY(canvas.height*localPos.y);
    });

    useInteraction(ref, 'onSelect', (e) => {
        chart.ctx.fillStyle = "#000000";
        chart.ctx.beginPath();
        chart.ctx.arc(localCoord.x, localCoord.y, 8, 0, 2 * Math.PI);
        chart.ctx.fill();

        console.log(localCoord)

        const event = new MouseEvent('click', {
            clientX: localCoord.x,
            clientY: localCoord.y
        });

        chart.canvas.dispatchEvent(event);
    });

    useInteraction(ref, 'onHover', () => {
        hover = true;
    });

    useInteraction(ref, 'onBlur', () => {
        hover = false;
    });

    return (
        <block
            ref={ref}
            args={[
                {
                    width: 1,
                    height: 0.5,
                    fontSize: 0.1,
                    backgroundOpacity: 1,
                    fontFamily: "./Roboto-msdf.json",
                    fontTexture: "./Roboto-msdf.png"
                }
            ]}
        ></block>
    );
};

ChartPanel.displayName = "Chart Panel";

export default ChartPanel;
