import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/config'
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
  let string_read_ids = req.query.read_ids as string
  const read_ids: number[] =
    string_read_ids?.split(',').map((id: string) => Number(id)) || []

  try {
    const questionIds = await prisma.question.findMany({
      select: {
        id: true,
      },
      where: {
        NOT: {
          id: {
            in: read_ids,
          },
        },
      },
    })

    if (questionIds.length === 0) {
      res.status(200).json({
        status: 'success',
        data: {} as Question,
      })
    } else {
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
