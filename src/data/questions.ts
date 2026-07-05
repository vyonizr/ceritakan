import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface RawQuestion {
  id: number
  question: string
  topicId: number
}

let cachedQuestions: RawQuestion[] | null = null

export const getQuestions = (): RawQuestion[] => {
  if (cachedQuestions) {
    return cachedQuestions
  }

  const csvPath = path.join(process.cwd(), 'src/data/ceritakan_questions.csv')
  const csv = fs.readFileSync(csvPath, 'utf-8')
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  })

  cachedQuestions = records.map((record) => ({
    id: Number(record.id),
    question: record.question,
    topicId: Number(record.topic_id),
  }))

  return cachedQuestions
}
