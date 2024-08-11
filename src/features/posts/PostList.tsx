import { useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectPostById, selectPostsIds, addPost } from "./postsSlice"
import { EntityId } from "@reduxjs/toolkit"
import styles from "./Posts.module.scss"
import { useNavigate } from "react-router-dom"
import { YouLabel } from "../components/YouLabel"
import { TimeAgo } from "./TimeAgo"
import { TextareaModal } from "./TextareaModal"
import { PostExcerpt } from "./PostExcerpt"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const PostList = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const orderedPostsIds = useAppSelector(selectPostsIds)
  const currentUser = useAppSelector((state) => state.users.currentUser)

  const [addPostModalOpen, setAddPostModalOpen] = useState(false)
  const addPostModalContainerRef = useRef(null)
  const layedPosts = orderedPostsIds.map((postId) => {
    return (
      <PostExcerpt key={postId} postId={postId} currentUser={currentUser} />
    )
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
        <img src={`${frontendBaseUrl}/images/icon-add.svg`} alt="add" />
        add
      </button>
    </div>
  )
}
