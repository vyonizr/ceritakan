import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'src/utils/prisma'

type ResponsePayload = {
  status: string
  data?: object | []
  message?: string
  cursor?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
) {
  const q = req.query.q as string

  try {
    if (req.headers.api_key !== process.env.API_KEY) {
      res.status(401).json({
        status: 'failed',
        message: 'Authorization failed',
      })
    } else {
      const questions = await prisma.question.findMany({
        take: 25,
        cursor: {
          id: 1,
        },
        select: {
          id: true,
          question: true,
          topic: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          question: {
            contains: q,
            mode: 'insensitive',
          },
        },
      })

      const lastQuestion = questions[questions.length - 1]
      res.status(200).json({
        status: 'success',
        data: questions,
        cursor: lastQuestion.id,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    })
  } finally {
    await prisma.$disconnect()
  }
}
