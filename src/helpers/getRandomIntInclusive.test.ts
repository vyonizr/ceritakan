import { describe, it, expect, vi, beforeEach } from 'vitest'
import getRandomIntInclusive from './getRandomIntInclusive'

describe('getRandomIntInclusive', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns min when Math.random() is 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(getRandomIntInclusive(0, 10)).toBe(0)
  })

  it('returns max when Math.random() approaches 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    expect(getRandomIntInclusive(0, 10)).toBe(10)
  })

  it('returns an expected value for a given Math.random()', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(getRandomIntInclusive(0, 10)).toBe(5)
  })

  it('always returns an integer', () => {
    for (let i = 0; i < 100; i++) {
      expect(Number.isInteger(getRandomIntInclusive(0, 10))).toBe(true)
    }
  })

  it('stays within [min, max] inclusive', () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandomIntInclusive(0, 10)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(10)
    }
  })

  it('uses default args when none provided', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(getRandomIntInclusive()).toBe(-1)
  })
})
