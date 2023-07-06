import { useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectPostById, selectPostsIds, addPost } from "./postsSlice"
import { EntityId } from "@reduxjs/toolkit"
import styles from "./Posts.module.scss"
import { useNavigate } from "react-router-dom"
import { YouLabel } from "./YouLabel"
import { TimeAgo } from "./TimeAgo"
import { TextareaModal } from "./TextareaModal"

const frontentBaseUrl = "/poster-frontend"

export const PostList = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const orderedPostsIds = useAppSelector(selectPostsIds)
  const currentUser = useAppSelector((state) => state.users.currentUser)

  const [addPostModalOpen, setAddPostModalOpen] = useState(false)
  const addPostModalContainerRef = useRef(null)
  const addPostModalTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [addPostTextareaValue, setAddPostTextareaValue] = useState("")

  const PostExcerpt = ({ postId }: { postId: EntityId }) => {
    const post = useAppSelector((state) => selectPostById(state, postId))
    return (
      <div
        onClick={() => navigate(`${frontentBaseUrl}/posts/${postId}`)}
        className={styles.postPreviewContainer}
      >
        <div className={styles.postAuthorImgNameTimeAgo}>
          <img src={`/images/avatars/${post.author.image.webp}`} alt="author" />
          <span className={styles.userName}>{post.author.userName}</span>
          <YouLabel entity={post} currentUser={currentUser} />
          <TimeAgo timestamp={post.createdAt} />
        </div>
        <p className={styles.contentPreview}>
          {post.content.length < 80
            ? post.content
            : post.content.slice(0, 70) + "..."}
        </p>
      </div>
    )
  }

  const layedPosts = orderedPostsIds.map((postId) => {
    return <PostExcerpt key={postId} postId={postId} />
  })

  return (
    <div className={styles.postListPageContainer}>
      {orderedPostsIds.length ? (
        <div className={styles.postsPreviewContainer}>{layedPosts}</div>
      ) : (
        <div className={styles.notFoundContainer}>No posts found</div>
      )}

      {addPostModalOpen && (
        <TextareaModal
          modalContainerRef={addPostModalContainerRef}
          setIsModalOpened={setAddPostModalOpen}
          onConfirmation={(content) => {
            dispatch(addPost({ content, author: currentUser }))
          }}
          confirmBtnText="ADD POST"
        />
      )}

      <button
        onClick={() => setAddPostModalOpen(true)}
        className={styles.addPostBtn}
      >
        <img src="/images/icon-add.svg" alt="add" />
        add
      </button>
    </div>
  )
}
