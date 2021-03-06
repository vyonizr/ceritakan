import React from 'react'
import Link from 'next/link'

import { CardProps, Submission } from 'src/common/types'
import { ANONYMOUS } from 'src/common/constants'
import BaseCard from 'src/components/BaseCard'

interface SubmitterProps {
  submission: Submission
}

const Submitter = ({ submission }: SubmitterProps) => {
  if (
    submission.sender_type !== ANONYMOUS &&
    submission.sender_social_url.length > 0
  ) {
    return (
      <Link href={submission.sender_social_url} passHref>
        <a
          target='_blank'
          rel='noreferrer noopener'
          className='absolute bottom-0 p-3 mx-auto text-sm italic text-center text-primary'
        >
          {submission.sender_name}
        </a>
      </Link>
    )
  }

  return (
    <small className='absolute bottom-0 p-3 mx-auto italic text-center'>
      {submission.sender_type === ANONYMOUS ? 'Anonim' : submission.sender_name}
    </small>
  )
}

const Card: React.FC<CardProps> = ({ question }: CardProps) => (
  <BaseCard>
    <div className='relative w-full h-full p-4 border-2 select-none border-primary custom-flex-center rounded-2xl'>
      <p className='absolute right-0 w-full text-3xl text-center top-4 font-roustel'>
        Ceritakan
      </p>
      <div className='relative'>
        <p className='container absolute right-0 text-center -top-7'>
          {question.topic?.icon}
        </p>
        <p className='subpixel-antialiased text-center'>{question.question}</p>
      </div>
      {question.submission && <Submitter submission={question.submission} />}
    </div>
  </BaseCard>
)

export default Card
