import { ErrorPayload } from 'src/common/types'

const setErrorResponse = (
  message: string,
  code: number,
  name = 'CustomError'
): ErrorPayload => {
  const err: any = new Error(message)
  err.statusCode = code
  err.name = name

  throw err
}

export default setErrorResponse
