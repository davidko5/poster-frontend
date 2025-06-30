import { User } from "./user.type"

export interface Post {
  _id: string
  createdAt: string
  updatedAt: string
  content: string
  authorId: string
  score: number
  comments: Array<Comment>
}
