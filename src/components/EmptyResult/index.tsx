import React from 'react'

interface BackCardProps {
  startOver: () => void
}

const BackCard: React.FC<BackCardProps> = ({ startOver }) => (
  <div className='custom-flex-center flex-col'>
    <p className='my-3'>{'Maaf, kartunya sudah habis ☹️'}</p>
    <button className='p-3 text-white bg-primary rounded-lg font-medium'>
      <span className='text-white' onClick={startOver}>
        Mulai lagi
      </span>
    </button>
  </div>
)

export default BackCard
