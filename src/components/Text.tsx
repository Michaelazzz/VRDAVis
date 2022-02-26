import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import ThreeMeshUI from 'three-mesh-ui'
import { TextureLoader } from 'three'
extend(ThreeMeshUI)

import FontJSON from '../fonts/Roboto-Regular-msdf.json';

const fontName = 'Roboto'

const Text = (content: any) => {

    const textureLoader = new TextureLoader()

    textureLoader.load(require('../fonts/Roboto-Regular-msdf.png'), ( texture ) => {
        ThreeMeshUI.FontLibrary.addFont(fontName, FontJSON, texture)

    })

    const block = new ThreeMeshUI.Block( {
        width: 1.2,
		height: 0.5,
		padding: 0.05,
		justifyContent: 'center',
		alignContent: 'left',
		fontFamily: fontName,
		fontTexture: fontName
    } )

    block.add(
        new ThreeMeshUI.Text( {
            content: { content },
            fontSize: 0.08
        } )
    )

    return block
}

export default Text