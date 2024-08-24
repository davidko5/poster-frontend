import { useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectPostsIds, addPost } from "./postsSlice"
import styles from "./Posts.module.scss"
import { TextareaModal } from "./TextareaModal"
import { PostExcerpt } from "./PostExcerpt"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const PostList = () => {
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
        <div data-testid="noPostsModal" className={styles.notFoundContainer}>
          No posts found
        </div>
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
        disabled={!currentUser}
        onClick={() => setAddPostModalOpen(true)}
        className={styles.addPostBtn}
      >
        <img src={`${frontendBaseUrl}/images/icon-add.svg`} alt="add" />
        add
      </button>
    </div>
  )
}
