export interface User {
  _id: string
  userName: string
  createdAt: string
  updatedAt: string
  image: {
    png: string
    webp: string
  }
}
