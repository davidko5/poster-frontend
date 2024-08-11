import { User } from "./user.type"

export interface Reply {
  _id: string
  content: string
  score: number
  author: User
  repliedTo: string
  createdAt: string
  updatedAt: string
}
