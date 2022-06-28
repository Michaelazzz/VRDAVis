import React from 'react'

const PanelText = ({children}: any) => {
  return (
    <block
        args={[
            {
                width: 1,
                height: 0.25,
                backgroundOpacity: 0,
                justifyContent: "center"
            }
        ]}
    >
        {/* @ts-ignore */}
        <text content={children} />
    </block>
  )
}

export default PanelText