import React from 'react'

const BaseCard: React.FC = ({ children }) => (
  <div className='p-5 bg-white border-2 border-gray-100 rounded-lg shadow-xl custom-flex-center card-dimension dark:bg-gray-800'>
    {children}
  </div>
)

export default BaseCard
