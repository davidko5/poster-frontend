import { User } from "./user.type"

export interface Post {
  _id: string
  createdAt: string
  updatedAt: string
  content: string
  author: User
  score: number
  comments: Array<Comment>
}
