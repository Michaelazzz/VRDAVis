import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";

import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, BasePlatform } from "chart.js";
import { useController, useInteraction, useXR, useXRFrame } from "@react-three/xr";
import { extend, useThree } from "@react-three/fiber";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";

import ThreeMeshUI from "three-mesh-ui";

extend(ThreeMeshUI);

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title);

const ChartObject = ({onMount}: any) => {

    const ref = useRef<Object3D>();

    const [textureData, setTextureData] = useState("");

    const loader = new THREE.TextureLoader();

    useEffect(() => {
        onMount([textureData, setTextureData]);
        loader.load(textureData, texture => {
            // @ts-ignore
            ref.current.set({backgroundTexture: texture});
        });
        // console.log('texture update');
    }, [onMount, textureData]);

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

const ChartPanel = ({data}: any) => {
    const ref = useRef<Object3D>();
    const { gl, scene } = useThree();
    const rightController = useController("right");
    let textureData = null;
    let setTextureData:any = null;
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

    let chart: Chart

    scene.add( sphere );

    const onChildMount = (dataFromChild: any) => {
        textureData = dataFromChild[0];
        setTextureData = dataFromChild[1];
    };

    useEffect(() => {

        chart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: ["Red", "Orage", "Yellow", "Green", "Blue", "Purple", "Grey"],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 60],
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
                // animation: {
                //     duration: 0
                // },
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
                },
                onHover: (e) => {
                    // console.log(e);
                },
                events: ['mousemove', 'click']
            }
        });
        chart.update();
    });


    useXRFrame((time, xFrame) => {

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
        ThreeMeshUI.update();
        // console.log(ThreeMeshUI)
    });

    useInteraction(ref, 'onSelect', () => {
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
                    backgroundOpacity: 0,
                    fontFamily: "./Roboto-msdf.json",
                    fontTexture: "./Roboto-msdf.png"
                }
            ]}
        >
            <ChartObject
                onMount={onChildMount}
            ></ChartObject>
        </block>
        
    );
};

ChartPanel.displayName = "Chart Panel";

export default ChartPanel;
