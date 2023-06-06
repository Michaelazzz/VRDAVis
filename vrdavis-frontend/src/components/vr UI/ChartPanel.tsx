import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";

import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend, BasePlatform } from "chart.js";
import { useController, useInteraction, useXR } from "@react-three/xr";
import { useThree, useFrame } from "@react-three/fiber";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";

Chart.register(BarController, BarElement, LinearScale, CategoryScale,Tooltip, Legend, Title);

const ChartPanel = ({data}: any) => {
    const ref = useRef<Object3D>();
    const { gl, scene } = useThree();
    const rightController = useController("right");
    const raycaster = new Raycaster();
    let localPos = new Vector3(0,0,0);
    const geometry = new THREE.SphereGeometry( 0.01, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    let hover = false;

    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 250;
    
    const localCoord = new Vector2(0,0);

    const [textureData, setTextureData] = useState("");
    const loader = new THREE.TextureLoader();

    // @ts-ignore
    const [chart, setChart] = useState(new Chart(canvas.getContext('2d'), {
        type: "bar",
        data: {
            labels: ["Red", "Orage", "Yellow", "Green", "Blue", "Purple", "Grey"],
            datasets: [{
                label: 'My First Dataset',
                data: data,
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
            // onClick: (e) => {
                
            // },
            // onHover: (e) => {
                // setTextureData(chart.toBase64Image());
            // },
            // events: ['mousemove', 'click']
        }
    }));

    scene.add( sphere );
    
    useEffect(() => {

        // chart.update();
        // chart.options.onClick = () => {
            // console.log('click received');
            // sphere.material.copy(new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
        // }

        loader.load(textureData, texture => {
            // @ts-ignore
            ref.current.set({backgroundTexture: texture});
        });
    });


    useFrame((time, xFrame) => {

        if (!ref.current) 
            return;
        
        if(rightController && hover) 
        {
            let targetRay = new Vector3();
            rightController.controller.getWorldDirection(targetRay).negate();
            let position = new Vector3();
            rightController.controller.getWorldPosition(position);

            raycaster.set(position, targetRay);
        
            let intersection = raycaster.intersectObject(ref.current as Object3D);

            if(!intersection[0])
            {
                return;
            }
            
            const event = new MouseEvent('mousemove', {
                clientX: localCoord.x,
                clientY: localCoord.y
            });

            chart.canvas.dispatchEvent(event);
            // worker.postMessage({action: "mousemove", localCoords: localCoord});


            sphere.position.copy(intersection[0].point);
            localPos.copy(ref.current.worldToLocal(intersection[0].point)); // converts point in world space to local space
            localCoord.setX(500*(localPos.x+0.5));
            localCoord.setY(canvas.height*Math.abs(localPos.y-0.25));
        }
        else 
        {
            sphere.position.copy(new Vector3(0,0,0));
        }

        setTextureData(chart.toBase64Image());
        
    });

    // @ts-ignore
    useInteraction(ref, 'onSelect', () => {
        const event = new MouseEvent('click', {
            clientX: localCoord.x,
            clientY: localCoord.y
        });

        chart.canvas.dispatchEvent(event);
        // console.log('click sent')
    });

    // @ts-ignore
    useInteraction(ref, 'onHover', () => {
        hover = true;
    });

    // @ts-ignore
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
