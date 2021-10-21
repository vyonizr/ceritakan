export interface Question {
  id: number
  question: string
  topic: Topic
  submission?: Submission
  created_at?: string
  updated_at?: string
}

export interface CardProps {
  question: Question
}

export interface Topic {
  id: number
  name: string
  icon: string
  created_at?: string
  updated_at?: string
}

export interface ErrorPayload {
  name: string
  statusCode: number
  message: string
}
export interface Submission {
  sender_name: number
  sender_social_url: string
  sender_type: string
}
