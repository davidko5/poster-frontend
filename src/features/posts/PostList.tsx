import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchPosts, selectPostById, selectPostsIds } from "./postsSlice"
import { EntityId } from "@reduxjs/toolkit"
import styles from "./Posts.module.scss"
import { useNavigate } from "react-router-dom"

export const PostList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const orderedPostsIds = useAppSelector(selectPostsIds)
  const postsFetchStatus = useAppSelector((state) => state.posts.status)
  useEffect(() => {
    if (postsFetchStatus === "idle") dispatch(fetchPosts())
    // dispatch(fetchPosts())
  })

  const PostExcerpt = ({ postId }: { postId: EntityId }) => {
    const post = useAppSelector((state) => selectPostById(state, postId))
    return (
      <div
        onClick={() => navigate(`/posts/${postId}`)}
        className={styles.postPreviewContainer}
      >
        <h4>{post.title}</h4>
        <p>
          {post.content.length < 50
            ? post.content
            : post.content.slice(0, 50) + "..."}
        </p>
      </div>
    )
  }

  const layedPosts = orderedPostsIds.map((postId) => {
    return <PostExcerpt key={postId} postId={postId} />
  })

  return <div className={styles.postsPreviewContainer}>{layedPosts}</div>
}
