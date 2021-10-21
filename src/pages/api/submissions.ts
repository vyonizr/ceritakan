import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/config'
import { setErrorResponse } from 'src/helpers'
import { ANONYMOUS, IDENTIFIED } from 'src/common/constants'
import type { SenderType } from '@prisma/client'

import {
  MINIMUM_QUESTION_LENGTH,
  MAXIMUM_QUESTION_LENGTH,
  MAXIMUM_NAME_LENGTH,
} from 'src/common/constants'
import { REGEX_URL } from 'src/helpers/regex'

type ResponsePayload = {
  status: string
  data?: any
  message?: string
}

type RequestBody = {
  topic_id: string
  question: string
  submit_as: string
  name: string
  social_url: string
}

const validateSubmission = (body: RequestBody) => {
  const { topic_id, question, submit_as, name, social_url } = body

  if (Number(topic_id) < 1) {
    return setErrorResponse(`Parameter 'topic_id' required`, 422)
  }

  if (question.length < MINIMUM_QUESTION_LENGTH) {
    return setErrorResponse(`Question is too short`, 422)
  }

  if (question.length > MAXIMUM_QUESTION_LENGTH) {
    return setErrorResponse(`Question is too long`, 422)
  }

  if (submit_as !== ANONYMOUS && submit_as !== IDENTIFIED) {
    return setErrorResponse(`Parameter 'submit_as' is invalid.`, 422)
  }

  if (submit_as === IDENTIFIED) {
    if (name.length < 1) {
      return setErrorResponse(`Parameter 'name' required`, 422)
    }

    if (name.length > MAXIMUM_NAME_LENGTH) {
      return setErrorResponse(
        `Maximum 'name' is ${MAXIMUM_NAME_LENGTH} characters long`,
        422
      )
    }

    if (social_url.length > 0 && !REGEX_URL.test(social_url)) {
      return setErrorResponse(
        `Invalid URL. Valid example: https://twitter.com/twitter`,
        422
      )
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePayload>
) {
  try {
    switch (req.method) {
      case 'POST':
        const parsedBody: RequestBody = JSON.parse(req.body)
        const { topic_id, question, submit_as, name, social_url } = parsedBody

        validateSubmission(parsedBody)

        const createdSubmission = await prisma.submission.create({
          data: {
            topic_id: Number(topic_id),
            content: question,
            sender_type: submit_as as SenderType,
            sender_name: submit_as === IDENTIFIED ? name : null,
            sender_social_url: submit_as === IDENTIFIED ? social_url : null,
          },
        })

        return res.status(201).json({
          status: 'success',
          data: createdSubmission,
        })
      default:
        return res.status(200).json({
          status: 'success',
        })
    }
  } catch (error: any) {
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
