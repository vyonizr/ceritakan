import { describe, it, expect } from 'vitest'
import setErrorResponse from './setErrorResponse'

describe('setErrorResponse', () => {
  it('throws an Error with the given message and statusCode', () => {
    let err: any
    try {
      setErrorResponse('test error', 400)
    } catch (e) {
      err = e
    }
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('test error')
    expect(err.statusCode).toBe(400)
  })

  it('defaults name to CustomError', () => {
    let err: any
    try {
      setErrorResponse('msg', 500)
    } catch (e) {
      err = e
    }
    expect(err.name).toBe('CustomError')
  })

  it('sets name when provided', () => {
    let err: any
    try {
      setErrorResponse('msg', 500, 'MyError')
    } catch (e) {
      err = e
    }
    expect(err.name).toBe('MyError')
  })
})
