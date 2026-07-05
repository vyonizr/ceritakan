import { describe, it, expect } from 'vitest'
import { REGEX_COMMA_SEPARATED_NUMBER } from './regex'

describe('REGEX_COMMA_SEPARATED_NUMBER', () => {
  it('matches a single number', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('5')).toBe(true)
  })

  it('matches comma-separated numbers', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('1,2,3')).toBe(true)
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('10,20,30')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('')).toBe(false)
  })

  it('rejects consecutive commas', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('1,,2')).toBe(false)
  })

  it('rejects non-numeric values', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('a,b')).toBe(false)
  })

  it('rejects trailing comma', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test('1,')).toBe(false)
  })

  it('rejects leading comma', () => {
    expect(REGEX_COMMA_SEPARATED_NUMBER.test(',1')).toBe(false)
  })
})
