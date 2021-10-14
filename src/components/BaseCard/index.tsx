import React from 'react'

const BaseCard: React.FC = ({ children }) => (
  <div className='custom-flex-center h-96 w-72 border-2 border-gray-100 rounded-lg p-5 shadow-xl'>
    {children}
  </div>
)

export default BaseCard
