import { User } from "./user.type"

export interface Reply {
  _id: string
  content: string
  score: number
  authorId: string
  repliedTo: string
  createdAt: string
  updatedAt: string
}
