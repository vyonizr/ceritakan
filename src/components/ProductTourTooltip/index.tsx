import React from 'react'
import dynamic from 'next/dynamic'
import { Props } from 'react-joyride'

const Joyride = dynamic(() => import('react-joyride'), { ssr: false })

const ProductTourTooltip = ({ callback, steps, run, stepIndex }: Props) => {
  return (
    <Joyride
      callback={callback}
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      styles={{
        options: { primaryColor: '#3B82F6', zIndex: 1 },
        buttonNext: {
          display: 'none',
        },
      }}
      disableOverlay
      hideBackButton
      disableCloseOnEsc
    />
  )
}

export default ProductTourTooltip
