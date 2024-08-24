import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from "./Posts.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchPosts,
  editPost,
  selectPostById,
  addComment,
  deletePost,
} from "./postsSlice"
import { EntityId } from "@reduxjs/toolkit"
import { PlusMinusInput } from "./PlusMinusInput"
import { TimeAgo } from "./TimeAgo"
import { ReplyInput } from "./ReplyInput"
import { EditInput } from "./EditInput"
import { YouLabel } from "../components/YouLabel"
import { DeleteModal } from "../components/DeleteModal"
import { Comment } from "../../types"
import { ReplyBtn } from "./ReplyBtn"
import { CommentComponent } from "./CommentComponent"
import { DeleteEditBtns } from "./DeleteEditBtns"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const SinglePost = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const id = useParams()["id"]
  const post = useAppSelector((state) => selectPostById(state, id as EntityId))
  const currentUser = useAppSelector((state) => state.users.currentUser)
  const postReplyInputTextareaRef = useRef<HTMLTextAreaElement>(null)
  const authorIdToReplyTo = useRef("")
  const [isEditing, setIsEditing] = useState(false)
  const [textareaValue, setTextareaValue] = useState("")
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const editPostDispatcher = ({
    content,
    score,
    postId,
  }: {
    content?: string
    score?: string
    postId: string
  }) => {
    dispatch(
      editPost({
        content,
        score,
        postId,
      }),
    )
  }

  const postsFetchStatus = useAppSelector((state) => state.posts.status)

  useEffect(() => {
    if (postsFetchStatus === "idle") dispatch(fetchPosts())
    if (post && post.content) setTextareaValue(post.content)

    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [post, dispatch, postsFetchStatus])

  if (!id) return null

  if (post) {
    return (
      <>
        <div data-testid="postContainer" className={styles.postContainer}>
          <div className={styles.postBody}>
            {windowSize.width > 900 && (
              <PlusMinusInput
                score={Number(post.score)}
                onPlusMinusClickHandler={(valueToIncrement) =>
                  editPostDispatcher({
                    score: String(post.score + valueToIncrement),
                    postId: post._id,
                  })
                }
              />
            )}
            <div className={styles.userLabelAndContentContainer}>
              <div className={styles.postAuthorImgNameTimeAgo}>
                <img
                  src={`${frontendBaseUrl}/images/avatars/${post.author.image.webp}`}
                  alt="author"
                />
                <span className={styles.userName}>{post.author.userName}</span>
                <YouLabel entity={post} currentUser={currentUser} />
                <TimeAgo timestamp={post.createdAt} />
                {windowSize.width > 900 && post.author._id === currentUser && (
                  <DeleteEditBtns
                    onDeleteClicked={() => setDeleteModalOpened(true)}
                    onEditClicked={() => {
                      setIsEditing(!isEditing)
                    }}
                  />
                )}
                {windowSize.width > 900 && (
                  <ReplyBtn
                    authorIdToReplyTo={authorIdToReplyTo}
                    textareaToFocus={postReplyInputTextareaRef}
                    style={
                      post.author._id === currentUser
                        ? { marginLeft: "10px" }
                        : { marginLeft: "auto" }
                    }
                  />
                )}
              </div>
              {!isEditing ? (
                <>
                  <p data-testid="content" className={styles.content}>
                    {post.content}
                  </p>
                </>
              ) : (
                <EditInput
                  entityValue={post.content}
                  textareaValue={textareaValue}
                  setTextareaValue={setTextareaValue}
                  setIsEditing={setIsEditing}
                  onUpdate={() => {
                    dispatch(
                      editPost({
                        content: textareaValue,
                        postId: post._id,
                      }),
                    )
                    setIsEditing(false)
                  }}
                />
              )}
              <div className={styles.plusMinusDeleteEditReplyReplacedContainer}>
                {windowSize.width < 900 && (
                  <PlusMinusInput
                    score={Number(post.score)}
                    onPlusMinusClickHandler={(valueToIncrement) =>
                      editPostDispatcher({
                        score: String(post.score + valueToIncrement),
                        postId: post._id,
                      })
                    }
                  />
                )}
                {windowSize.width < 900 && post.author._id === currentUser && (
                  <DeleteEditBtns
                    onDeleteClicked={() => setDeleteModalOpened(true)}
                    onEditClicked={() => {
                      setIsEditing(!isEditing)
                    }}
                  />
                )}
                {windowSize.width < 900 && (
                  <ReplyBtn
                    authorIdToReplyTo={authorIdToReplyTo}
                    textareaToFocus={postReplyInputTextareaRef}
                    style={
                      post.author._id === currentUser
                        ? { marginLeft: "10px" }
                        : { marginLeft: "auto" }
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className={styles.commentsContainer}>
            {post.comments.map((comment) => (
              <CommentComponent
                authorIdToReplyTo={authorIdToReplyTo}
                key={comment._id}
                postId={post._id}
                comment={comment as Comment}
                windowSize={windowSize}
              />
            ))}
          </div>
          <ReplyInput
            placeholder="Add a comment"
            textareaRef={postReplyInputTextareaRef}
            btnText="SEND"
            onSendClick={(content: string) =>
              dispatch(
                addComment({
                  postId: post._id,
                  content: content,
                  author: currentUser,
                }),
              )
            }
          />
        </div>
        {deleteModalOpened && (
          <DeleteModal
            setModalOpened={setDeleteModalOpened}
            onConfirmation={() => {
              dispatch(
                deletePost({
                  postId: post._id,
                }),
              )
              navigate(`${frontendBaseUrl}/posts`)
            }}
            titleText="Delete comment"
            cancelBtnText="NO, CANCEL"
            confirmBtnText="YES, DELETE"
          />
        )}
      </>
    )
  } else return <p>Post not found</p>
}
