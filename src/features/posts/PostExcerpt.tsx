import { EntityId } from "@reduxjs/toolkit"
import { useAppSelector } from "../../app/hooks"
import { selectPostById } from "./postsSlice"
import { useNavigate } from "react-router-dom"
import styles from "./Posts.module.scss"
import { YouLabel } from "../components/YouLabel"
import { TimeAgo } from "./TimeAgo"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export function PostExcerpt({
  postId,
  currentUser,
}: {
  postId: EntityId
  currentUser: string
}) {
  const navigate = useNavigate()
  const post = useAppSelector((state) => selectPostById(state, postId))

  return post ? (
    <div
      data-testid="postExcerpt"
      onClick={() => navigate(`${frontendBaseUrl}/posts/${postId}`)}
      className={styles.postPreviewContainer}
    >
      <div className={styles.postAuthorImgNameTimeAgo}>
        <img
          src={`${frontendBaseUrl}/images/avatars/${post.author.image.webp}`}
          alt="author"
        />
        <span className={styles.userName}>{post.author.userName}</span>
        <YouLabel entity={post} currentUser={currentUser} />
        <TimeAgo timestamp={post.createdAt} />
      </div>
      <p data-testid="postExcerptContent" className={styles.contentPreview}>
        {post.content.length < 80
          ? post.content
          : post.content.slice(0, 70) + "..."}
      </p>
    </div>
  ) : (
    <div className={styles.postPreviewContainer}>
      {"Post isn't yet fetched"}
    </div>
  )
}
