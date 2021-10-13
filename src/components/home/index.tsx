import React, { ReactChildren, ReactChild } from 'react'

interface Props {
  children: ReactChild | ReactChildren
}

const HomeContainer = ({ children }: Props) => {
  return <div className='container mx-auto'>{children}</div>
}

export default HomeContainer
