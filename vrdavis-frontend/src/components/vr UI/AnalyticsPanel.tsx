import {useMemo, useRef, useState} from "react";
import * as THREE from "three";

import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import { useController, useInteraction } from "@react-three/xr";
import { useThree, useFrame } from "@react-three/fiber";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";
import { observer } from "mobx-react";

Chart.register(BarController, BarElement, LinearScale, CategoryScale,Tooltip, Legend, Title);

const AnalyticsPanelView: React.FC<{position?: number[], text?: string, width?: number, labels: number[], data: number[]}> = ({position=[0,0,0], text='text', width=1, labels, data}: any) => {
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
    const context = canvas.getContext('2d');

    context!.fillStyle = '#000';
    
    const localCoord = new Vector2(0,0);

    // @ts-ignore
    const chart = useMemo(() => new Chart(canvas.getContext('2d'), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: text,
                data: data,
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                'rgb(255, 99, 132)'
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
    }), [canvas, data, labels, text]);

    const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
    texture.needsUpdate = true;

    const geometry = useMemo(() => new THREE.PlaneGeometry(width, 0.5), [width]);
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
            position={[position[0], position[1], position[2]]}
        ></group>
    )
}

const AnalyticsPanel = observer(AnalyticsPanelView);
export { AnalyticsPanel };
