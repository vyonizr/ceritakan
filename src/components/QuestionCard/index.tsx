import React from 'react'
import { CardProps } from 'src/common/types'
import BaseCard from 'src/components/BaseCard'

const Card: React.FC<CardProps> = ({ question }: CardProps) => (
  <BaseCard>
    <div className='relative w-full h-full p-4 border-2 border-blue-900 custom-flex-center rounded-2xl'>
      <p className='absolute right-0 w-full text-3xl text-center text-gray-700 select-none top-4 font-roustel'>
        Ceritakan
      </p>
      <p className='subpixel-antialiased text-center text-gray-700 select-none'>
        {question.question}
      </p>
    </div>
  </BaseCard>
)

export default Card
