import React from 'react'
import { CardProps } from 'src/common/types'
import BaseCard from 'src/components/BaseCard'

const Card: React.FC<CardProps> = ({ question }: CardProps) => (
  <BaseCard>
    <div className='relative w-full h-full p-4 border-2 border-primary custom-flex-center rounded-2xl'>
      <p className='absolute right-0 w-full text-3xl text-center select-none top-4 font-roustel'>
        Ceritakan
      </p>
      <div className='relative'>
        <p className='container absolute right-0 text-center select-none -top-7'>
          {question.topic?.icon}
        </p>
        <p className='subpixel-antialiased text-center select-none'>
          {question.question}
        </p>
      </div>
    </div>
  </BaseCard>
)

export default Card
