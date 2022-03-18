import React, {useEffect, useRef} from 'react'
import { Html } from '@react-three/drei'

const Canvas = () => {

    const ref = useRef(null)

    const draw = (ctx, frameCount) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        ctx.fill()
    }
    
    useEffect(() => {
        const canvas = ref.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }

        // dataRef = canvas.toDataURL()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])
    
    return (
        <canvas ref={ref} />
    )
}

export default Canvas