import React from 'react'

const BaseCard: React.FC = ({ children }) => (
  <div className='custom-flex-center card-dimension border-2 border-gray-100 rounded-lg p-5 shadow-xl'>
    {children}
  </div>
)

export default BaseCard
