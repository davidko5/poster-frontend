import { Reply } from "./reply.type"
import { User } from "./user.type"

export interface Comment {
  _id: string
  content: string
  score: number
  author: User
  createdAt: string
  updatedAt: string
  replies: Array<Reply>
}
