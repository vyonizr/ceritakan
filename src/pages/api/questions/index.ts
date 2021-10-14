import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/config'
import { setErrorResponse } from 'src/helpers'
import { Question } from 'src/common/types'

type ResponsePayload = {
  status: string
  data?: Question[] | []
  message?: string
  cursor?: number | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
) {
  const q = req.query.q as string
  const after_id = (req.query.after_id as string) || 1
  const results_size = (req.query.results_size as string) || 10

  try {
    if (req.headers.api_key !== process.env.API_KEY) {
      setErrorResponse('Authorization failed', 401)
    } else {
      const questions = await prisma.question.findMany({
        take: Number(results_size) > 50 ? 10 : Number(results_size),
        cursor: {
          id: Number(after_id),
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
      return res.status(200).json({
        status: 'success',
        data: questions,
        cursor: lastQuestion?.id ? lastQuestion.id : null,
      })
    }
  } catch (error: any) {
    console.log(error)
    if (error.name === 'CustomError') {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      })
    } else {
      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
      })
    }
  } finally {
    await prisma.$disconnect()
  }
}
