import React from 'react'
import dynamic from 'next/dynamic'
import { Props } from 'react-joyride'

const Joyride = dynamic(() => import('react-joyride').then((mod) => mod.Joyride), { ssr: false })

const ProductTourTooltip = ({ onEvent, steps, run, stepIndex }: Props) => {
  return (
    <Joyride
      onEvent={onEvent}
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      options={{
        primaryColor: '#3B82F6',
        zIndex: 1,
        hideOverlay: true,
        buttons: ['close', 'primary'],
        dismissKeyAction: false,
      }}
      styles={{
        buttonPrimary: {
          display: 'none',
        },
      }}
    />
  )
}

export default ProductTourTooltip
