import { describe, it, expect, vi, beforeEach } from 'vitest'
import getRandomFloat from './getRandomFloat'

describe('getRandomFloat', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns min when Math.random() is 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(getRandomFloat(0, 10)).toBe(0)
  })

  it('returns expected value for a given Math.random()', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(getRandomFloat(0, 10)).toBe(5)
  })

  it('rounds result to 1 decimal place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25)
    expect(getRandomFloat(0, 10)).toBe(2.5)
  })

  it('stays within bounds for many random values', () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandomFloat(-5, 5)
      expect(result).toBeGreaterThanOrEqual(-5)
      expect(result).toBeLessThanOrEqual(5)
    }
  })

  it('uses default args when none provided', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(getRandomFloat()).toBe(-1)
  })
})
