import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'src/utils/prisma'
import getRandomIntInclusive from 'src/helpers/getRandomIntInclusive'

type Question = {
  id: number
  question: string
} | null

type ResponsePayload = {
  status: string
  data?: Question | Question[]
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
) {
  try {
    const questionIds = await prisma.question.findMany({
      select: {
        id: true,
      },
    })

    const randomIndex = getRandomIntInclusive(0, questionIds.length - 1)
    const randomId = questionIds[randomIndex].id

    const randomQuestion: Question = await prisma.question.findUnique({
      select: {
        id: true,
        question: true,
      },
      where: {
        id: randomId,
      },
    })

    res.status(200).json({
      status: 'success',
      data: randomQuestion,
    })
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    })
  } finally {
    await prisma.$disconnect()
  }
}
