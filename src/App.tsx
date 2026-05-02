import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { fetchPosts } from "./features/posts/postsSlice"
import { fetchUsers, getAuthenticatedUser } from "./features/users/usersSlice"
import "./App.css"
import { PostList } from "./features/posts/PostList"
import { SinglePost } from "./features/posts/SinglePost"
import { Navbar } from "./features/navbar/Navbar"
import { UsersList } from "./features/users/UsersList"
import { BackgroundPaths } from "./features/components/BackgroundPaths"
import { frontendBaseUrl } from "./misc-constant"

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAuthenticatedUser())
    dispatch(fetchPosts())
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <BrowserRouter>
      <BackgroundPaths />
      <Navbar />
      <Routes>
        <Route
          path={`${frontendBaseUrl}/`}
          Component={() => <Navigate to={`${frontendBaseUrl}/posts`} />}
        />
        <Route path={`${frontendBaseUrl}/posts`} Component={PostList} />
        <Route path={`${frontendBaseUrl}/posts/:id`} Component={SinglePost} />
        <Route path={`${frontendBaseUrl}/users`} Component={UsersList} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
