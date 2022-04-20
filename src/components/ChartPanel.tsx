import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";

import Chart from "chart.js";
import { useController, useInteraction, useXR, useXRFrame } from "@react-three/xr";
import { useThree } from "@react-three/fiber";

// Chart.register(LinearScale, BarController, PointElement, LineElement, Tooltip, Legend, ArcElement, CategoryScale, BarElement)

const ChartPanel = ({data}: any) => {
    const ref = useRef();

    const { gl } = useThree();
    let referenceSpace = gl.xr.getReferenceSpace();

    let hover = false;

    const rightController = useController("right");

    const loader = new THREE.TextureLoader();

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 250;
    let chart: Chart
    

    useEffect(() => {
        // draw on canvas
        if (ctx) {

            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [
                        {
                            label: "# of Votes",
                            data: data,
                            backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
                            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: false,
                    // animation: {
                    //     duration: 0
                    // }
                }
            });
            chart.update();
        }
    });

    useXRFrame((time, xFrame) => {
        var dataURL = chart.toBase64Image();
        if (ref) {
            loader.load(dataURL, texture => {
                // @ts-ignore
                ref.current.set({backgroundTexture: texture});
            });


            if(hover && rightController && referenceSpace) {
                // console.log(gl.xr);
                
                let targetRayPose = xFrame.getPose(rightController.inputSource.targetRaySpace, referenceSpace); // transform corresponding to the target ray
                let targetRayOrigin = targetRayPose?.transform.position; // origin point of the ray, at the front of the controller
                let targetRayVector = targetRayPose?.transform.orientation; // direction the ray is pointing
                
                // console.log(targetRayVector);
                
            }
        }
    });

    

    useInteraction(ref, 'onHover', (e) => {
        hover = true;
        let interX = e.intersection?.point.x;
        // console.log( interX ? 500*interX : 'no');
        console.log(e);
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

export default ChartPanel;
