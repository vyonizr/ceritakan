import { describe, it, expect, vi, beforeEach } from 'vitest'
import handler from './random'

vi.mock('src/data/questions', () => ({
  getQuestions: vi.fn(),
}))

import { getQuestions } from 'src/data/questions'

function createMockReqRes(overrides: {
  query?: Record<string, string>
  body?: Record<string, string>
}) {
  const req: any = {
    query: overrides.query ?? {},
    body: overrides.body ?? undefined,
  }
  const json = vi.fn()
  const res: any = {
    status: vi.fn(() => ({ json })),
  }
  return { req, res, json }
}

describe('random handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('excludes ids from query parameter', () => {
    vi.mocked(getQuestions).mockReturnValue([
      { id: 1, question: 'Q1', topicId: 1 },
      { id: 2, question: 'Q2', topicId: 2 },
      { id: 3, question: 'Q3', topicId: 3 },
    ])

    const { req, res, json } = createMockReqRes({ query: { r_ids: '1,3' } })
    handler(req, res)

    expect(json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        id: 2,
        question: 'Q2',
        topic: { id: 2, name: 'Cinta', icon: '❤️' },
      },
    })
  })

  it('excludes ids from body parameter', () => {
    vi.mocked(getQuestions).mockReturnValue([
      { id: 1, question: 'Q1', topicId: 1 },
      { id: 2, question: 'Q2', topicId: 2 },
    ])

    const { req, res, json } = createMockReqRes({ body: { r_ids: '1' } })
    handler(req, res)

    expect(json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        id: 2,
        question: 'Q2',
        topic: { id: 2, name: 'Cinta', icon: '❤️' },
      },
    })
  })

  it('returns empty data when no unseen questions remain', () => {
    vi.mocked(getQuestions).mockReturnValue([
      { id: 1, question: 'Q1', topicId: 1 },
    ])

    const { req, res, json } = createMockReqRes({ query: { r_ids: '1' } })
    handler(req, res)

    expect(json).toHaveBeenCalledWith({
      status: 'success',
      data: {},
    })
  })

  it('returns question shape with topic data', () => {
    vi.mocked(getQuestions).mockReturnValue([
      { id: 5, question: 'Some question?', topicId: 1 },
    ])

    const { req, res, json } = createMockReqRes({ query: {} })
    handler(req, res)

    expect(json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        id: 5,
        question: 'Some question?',
        topic: { id: 1, name: 'Umum', icon: '🌐' },
      },
    })
  })
})
