import React from 'react'

import { SITE_DESCRIPTION } from 'src/common/constants'

interface IntroductionModalProps {
  onClose: () => void
}

const IntroductionModal: React.FC<IntroductionModalProps> = ({ onClose }) => {
  return (
    <div className='absolute flex-col w-screen h-screen text-white custom-flex-center '>
      <h1 className='z-20 mb-4 text-4xl text-center'>Selamat datang!</h1>
      <div className='z-20 grid grid-flow-row gap-4 w-72'>
        <p>{SITE_DESCRIPTION}</p>
        <p>
          Permainan ini idealnya dimainkan oleh dua orang, namun bisa lebih.
          Setiap pemain membuka kartu secara bergantian.
        </p>
        <p>
          Saat kartu dibuka, pertanyaan dapat dijawab oleh pemain lain atau kamu
          juga bisa ikut menjawabnya.
        </p>
        <p>Ketuk tombol “Oke” untuk melanjutkan.</p>
      </div>
      <button
        className='z-20 px-5 py-3 mt-6 font-medium rounded-lg bg-primary'
        onClick={onClose}
      >
        <span>Oke</span>
      </button>
      <div className='absolute z-10 w-screen h-screen bg-gray-900 opacity-95' />
    </div>
  )
}

export default IntroductionModal
