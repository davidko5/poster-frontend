import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { fetchPosts } from "./features/posts/postsSlice"
import { fetchUsers } from "./features/users/usersSlice"
import "./App.css"
import { PostList } from "./features/posts/PostList"
import { SinglePost } from "./features/posts/SinglePost"
import { Navbar } from "./features/navbar/Navbar"
import { UsersList } from "./features/users/UsersList"

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchUsers())
  })

  const frontentBaseUrl = "/poster-frontend"

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path={`${frontentBaseUrl}/`}
          Component={() => <Navigate to={`${frontentBaseUrl}/posts`} />}
        />
        <Route path={`${frontentBaseUrl}/posts`} Component={PostList} />
        <Route path={`${frontentBaseUrl}/posts/:id`} Component={SinglePost} />
        <Route path={`${frontentBaseUrl}/users`} Component={UsersList} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
