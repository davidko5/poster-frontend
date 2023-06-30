import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { fetchPosts } from "./features/posts/postsSlice"
import { fetchUsers } from "./features/users/usersSlice"
import "./App.css"
import { PostList } from "./features/posts/PostList"
import { SinglePost } from "./features/posts/SinglePost"
import { Navbar } from "./features/navbar/Navbar"

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchUsers())
  })

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" Component={() => <Navigate to="/posts" />} />
        <Route path="/posts" Component={PostList} />
        <Route path="/posts/:id" Component={SinglePost} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
