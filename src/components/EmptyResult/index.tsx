import React from 'react'

interface BackCardProps {
  startOver: () => void
}

const BackCard: React.FC<BackCardProps> = ({ startOver }) => (
  <div className='flex-col custom-flex-center'>
    <p className='my-3'>{'Maaf, kartunya sudah habis ☹️'}</p>
    <button className='p-3 font-medium text-white rounded-lg bg-primary'>
      <span className='text-white' onClick={startOver}>
        Mulai lagi
      </span>
    </button>
  </div>
)

export default BackCard
