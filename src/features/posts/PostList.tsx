import { useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { addPost, selectPostIdsOrUndefined } from "./postsSlice"
import styles from "./Posts.module.scss"
import { TextareaModal } from "./TextareaModal"
import { PostExcerpt } from "./PostExcerpt"
import { RiseLoader } from "react-spinners"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const PostList = () => {
  const dispatch = useAppDispatch()

  const orderedPostsIds = useAppSelector(selectPostIdsOrUndefined)
  const currentUser = useAppSelector((state) => state.users.currentUser)

  const [addPostModalOpen, setAddPostModalOpen] = useState(false)
  const addPostModalContainerRef = useRef(null)
  const layedPosts = orderedPostsIds?.map((postId) => {
    return (
      <PostExcerpt key={postId} postId={postId} currentUser={currentUser?.id} />
    )
  })

  return (
    <div className={styles.postListPageContainer}>
      {!orderedPostsIds ? (
        <div
          data-testid="noPostsModal"
          style={{ flexDirection: "column" }}
          className={styles.notFoundContainer}
        >
          <p>
            Loading content. It can take up to a minute since free server is
            used
          </p>
          <div style={{ marginBottom: "16px" }}>
            <RiseLoader color="hsl(212, 24%, 26%)" />
          </div>
        </div>
      ) : orderedPostsIds.length ? (
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
            if (currentUser) {
              dispatch(addPost({ content, authorId: currentUser.id }))
            }
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
