import type { NextApiRequest, NextApiResponse } from 'next'
import { getQuestions } from 'src/data/questions'
import { TOPICS } from 'src/common/constants'
import { getRandomIntInclusive } from 'src/helpers'
import { Question } from 'src/common/types'

type ResponsePayload = {
  status: string
  data?: Question | {}
  message?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
) {
  const string_r_ids = req.query.r_ids as string
  const r_ids: number[] =
    string_r_ids?.split(',').filter(Boolean).map(Number) || []

  const unseenQuestions = getQuestions().filter((q) => !r_ids.includes(q.id))

  if (unseenQuestions.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: {},
    })
  }

  const randomIndex = getRandomIntInclusive(0, unseenQuestions.length - 1)
  const randomQuestion = unseenQuestions[randomIndex]

  res.status(200).json({
    status: 'success',
    data: {
      id: randomQuestion.id,
      question: randomQuestion.question,
      topic: {
        id: randomQuestion.topicId,
        ...TOPICS[randomQuestion.topicId],
      },
    },
  })
}
