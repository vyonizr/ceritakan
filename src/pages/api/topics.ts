import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/config'
import { Topic } from 'src/common/types'

type ResponsePayload = {
  status: string
  data?: Topic[] | []
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
) {
  try {
    const topics = await prisma.topic.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
    })
    return res.status(200).json({
      status: 'success',
      data: topics,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    })
  }
}
