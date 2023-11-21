import {useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";

import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend, BasePlatform } from "chart.js";
import { useController, useInteraction } from "@react-three/xr";
import { useThree, useFrame } from "@react-three/fiber";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";
import { observer } from "mobx-react";

Chart.register(BarController, BarElement, LinearScale, CategoryScale,Tooltip, Legend, Title);

const AnalyticsPanelView = ({data}: any) => {
    const ref = useRef<Object3D>();
    const { scene } = useThree();
    const rightController = useController("right");
    const raycaster = new Raycaster();
    let localPos = new Vector3(0,0,0);

    const geometrySphere = new THREE.SphereGeometry( 0.01, 32, 16 );
    const materialSphere = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometrySphere, materialSphere );

    const [hover, setHover] = useState(false);
    const [selected, setSelected] = useState(false);

    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 250;
    
    const localCoord = new Vector2(0,0);

    // @ts-ignore
    const chart = new Chart(canvas.getContext('2d'), {
        type: "bar",
        data: {
            labels: ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Grey"],
            datasets: [{
                label: 'My First Dataset',
                data: [1, 2, 3, 4, 5, 6, 7],
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
            }
        }
    });

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
    texture.needsUpdate = true;

    const geometry = useMemo(() => new THREE.PlaneGeometry(1, 0.5), []);
    const material = useMemo(() => new THREE.MeshBasicMaterial({
        map: texture
    }), [texture]);

    const mesh = useMemo(() => new THREE.Mesh(geometry, material), [geometry, material]);

    scene.add( sphere );
    
    // useEffect(() => {
    //     if(!ref.current) return;
    //     ref.current?.clear()
    //     ref.current.add(mesh);
    //     if(material.map) material.map.needsUpdate = true;
    // }, [mesh, material, localCoord.x, localCoord.y]);


    useFrame(() => {

        if (!ref.current) return;
        
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
            
            sphere.position.copy(intersection[0].point);
            localPos.copy(ref.current.worldToLocal(intersection[0].point)); // converts point in world space to local space
            localCoord.setX(500*(localPos.x+0.5));
            localCoord.setY(canvas.height*Math.abs(localPos.y-0.25));

            // worker.postMessage({action: "mousemove", localCoords: localCoord});
        }
        else 
        {
            sphere.position.copy(new Vector3(0,0,0));
        }

        if(!ref.current) return;
        ref.current?.clear()
        ref.current.add(mesh);
        if(material.map) material.map.needsUpdate = true;
        
    });

    // @ts-ignore
    useInteraction(ref, 'onSelectStart', () => {
        const event = new MouseEvent('click', {
            clientX: localCoord.x,
            clientY: localCoord.y
        });

        chart.canvas.dispatchEvent(event);
        console.log('click sent')
        if(!ref.current) return;
        ref.current?.clear()
        ref.current.add(mesh);
        if(material.map) material.map.needsUpdate = true;
    });

    // useInteraction(ref, 'onSelectEnd')

    // @ts-ignore
    // useInteraction(ref, 'onHover', () => {
    //     setHover(true);
    //     const event = new MouseEvent('mousemove', {
    //         clientX: localCoord.x,
    //         clientY: localCoord.y
    //     });

    //     chart.canvas.dispatchEvent(event);
    //     console.log('hover sent');
    //     if(!ref.current) return;
    //     ref.current?.clear()
    //     ref.current.add(mesh);
    //     if(material.map) material.map.needsUpdate = true;
    // });

    // @ts-ignore
    // useInteraction(ref, 'onBlur', () => {
    //     setHover(false);
    // });

    return (
        <group
            // @ts-ignore
            ref={ref}
        ></group>
    )
}

const AnalyticsPanel = observer(AnalyticsPanelView);
export { AnalyticsPanel };
