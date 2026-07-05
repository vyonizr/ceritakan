export interface Question {
  id: number
  question: string
  topic: Topic
}

export interface CardProps {
  question: Question
}

export interface Topic {
  id: number
  name: string
  icon: string
}

export interface ErrorPayload {
  name: string
  statusCode: number
  message: string
}
