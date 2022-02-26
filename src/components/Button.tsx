import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import ThreeMeshUI from 'three-mesh-ui'

import Text from './Text'

extend(ThreeMeshUI)

function Button ( { onClick }: any ) {


    const ref:any = useRef()
    // useInteraction(ref, 'onSelect', () => console.log('selected'))

    useEffect(() => {
        ref.current.setupState({
            state: 'hovered',
            attributes: {
                offset: 0.05,
                backgroundColor: new THREE.Color(0x999999),
                backgroundOpacity: 1,
                fontColor: new THREE.Color(0xffffff)
            }
        })

        ref.current.setupState({
            state: 'idle',
            attributes: {
                offset: 0.035,
                backgroundColor: new THREE.Color(0x666666),
                backgroundOpacity: 0.3,
                fontColor: new THREE.Color(0xffffff)
            }
        })

        ref.current.setupState({
            state: 'selected',
            attributes: {
                offset: 0.02,
                backgroundColor: new THREE.Color(0x777777),
                fontColor: new THREE.Color(0x222222)
            }
        })

        ref.current.setState('idle')
    })

    return (
        <block
            ref={ref}
            onPointerEnter={() => ref.current.setState('hovered')}
            onPointerLeave={() => ref.current.setState('idle')}
            onPointerDown={() => ref.current.setState('selected')}
            onPointerUp={() => {
                ref.current.setState('hovered')
                onClick()
            }}
            args={[
                {
                    width: 0.5,
                    height: 0.2,
                    justifyContent: 'center',
                    borderRadius: 0.075,
                }
            ]}
        >
            <text content={'click'} />

            
        </block>
    )
}

export default Button