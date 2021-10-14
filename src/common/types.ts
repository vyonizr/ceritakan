import { ReactNode } from 'react'

export interface Question {
  id: number
  question: string
  topic: Topic
  created_at?: string
  updated_at?: string
}

export interface CardProps {
  question: Question
}

export interface Topic {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface ErrorPayload {
  name: string
  statusCode: number
  message: string
}
