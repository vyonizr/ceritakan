import React from 'react'
import { CardProps } from 'src/common/types'
import BaseCard from 'src/components/BaseCard'

const Card: React.FC<CardProps> = ({ question }: CardProps) => (
  <BaseCard>
    <div className='custom-flex-center relative rounded-2xl border-2 border-blue-900 w-full h-full p-4'>
      <p className='absolute top-4 right-0 w-full text-center text-3xl text-gray-700 font-roustel'>
        Ceritakan
      </p>
      <p className='text-gray-700 text-center subpixel-antialiased'>
        {question.question}
      </p>
    </div>
  </BaseCard>
)

export default Card
