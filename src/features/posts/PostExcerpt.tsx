import { EntityId } from "@reduxjs/toolkit"
import { useAppSelector } from "../../app/hooks"
import { selectPostById } from "./postsSlice"
import { useNavigate } from "react-router-dom"
import styles from "./Posts.module.scss"
import { YouLabel } from "../components/YouLabel"
import { TimeAgo } from "./TimeAgo"
import { selectUserById } from "../users/usersSlice"
import { getPublicUserNamePlaceholder } from "../../utils/miscellaneous"
import { UserAvatar } from "../components/UserAvatar"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export function PostExcerpt({
  postId,
  currentUser,
}: {
  postId: EntityId
  currentUser: string | undefined
}) {
  const navigate = useNavigate()
  const post = useAppSelector((state) => selectPostById(state, postId))
  const author = useAppSelector((state) =>
    selectUserById(state, post?.authorId || ""),
  )

  return post ? (
    <div
      data-testid="postExcerpt"
      onClick={() => navigate(`${frontendBaseUrl}/posts/${postId}`)}
      className={styles.postPreviewContainer}
    >
      <div className={styles.postAuthorImgNameTimeAgo}>
        <UserAvatar userId={post.authorId} size={32} />
        <span className={styles.userName}>
          {author?.name || getPublicUserNamePlaceholder(post.authorId)}
        </span>
        {currentUser && (
          <YouLabel authorId={post.authorId} currentUserId={currentUser} />
        )}
        <TimeAgo timestamp={post.createdAt} />
      </div>
      <p data-testid="postExcerptContent" className={styles.contentPreview}>
        {post.content.length < 80
          ? post.content
          : post.content.slice(0, 70) + "..."}
      </p>
      <div className={styles.cardFooter}>
        <span className={styles.cardStat}>▲ {post.score}</span>
        <span className={styles.cardStat}>💬 {post.comments.length + post.comments.reduce((sum, c) => sum + c.replies.length, 0)}</span>
      </div>
    </div>
  ) : (
    <div className={styles.postPreviewContainer}>
      {"Post isn't yet fetched"}
    </div>
  )
}
