import { EntityId } from "@reduxjs/toolkit"
import { useAppSelector } from "../../app/hooks"
import { selectPostById } from "./postsSlice"
import { useNavigate } from "react-router-dom"
import styles from "./Posts.module.scss"
import { YouLabel } from "../components/YouLabel"
import { TimeAgo } from "./TimeAgo"
import { selectUserById } from "../users/usersSlice"
import { getPublicUserNamePlaceholder } from "../../utils/miscellaneous"

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
        {/* <img
          src={`${frontendBaseUrl}/images/avatars/${post.author.image.webp}`}
          alt="author"
        /> */}
        <img
          src={`${frontendBaseUrl}/images/profile-image-placeholder.png`}
          alt="author"
        />
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
    </div>
  ) : (
    <div className={styles.postPreviewContainer}>
      {"Post isn't yet fetched"}
    </div>
  )
}
