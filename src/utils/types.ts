export interface Author {
  _id: string
  userName: string
  createdAt: string
  updatedAt: string
  image: {
    png: string
    webp: string
  }
}

export interface Comment {
  _id: string
  content: string
  score: number
  author: Author
  createdAt: string
  updatedAt: string
  replies: Array<Reply>
}

export interface Reply {
  _id: string
  content: string
  score: number
  author: Author
  repliedTo: string
  createdAt: string
  updatedAt: string
}
