import React from 'react'
import ReactDOM from 'react-dom'

const Portal = ({children}:any) => {
    const portalRoot = document.getElementById('portal-root')
    // console.log(document.getElementById('portal-root'))

    const portalElement = (
        <div>
            {children}
        </div>
    )

    // return portalElement
  
    // @ts-ignore
    return ReactDOM.createPortal(portalElement, portalRoot)
}

export default Portal