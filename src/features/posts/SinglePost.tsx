import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from "./Posts.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchPosts,
  editPost,
  editComment,
  editReply,
  addReply,
  selectPostById,
  deleteReply,
  deleteComment,
  addComment,
  deletePost,
} from "./postsSlice"
import { selectUserById } from "../users/usersSlice"
import { EntityId } from "@reduxjs/toolkit"
import { PlusMinusInput } from "./PlusMinusInput"
import { TimeAgo } from "./TimeAgo"
import { ReplyInput } from "./ReplyInput"
import { EditInput } from "./EditInput"
import { YouLabel } from "./YouLabel"
import { Comment, Reply } from "../../utils/types"

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

  const sendCommentTextAreaFocus = (ref: any) => {
    ref.current && ref.current.focus()
  }

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

  const editCommentDispatcher = ({
    content,
    score,
    postId,
    commentId,
  }: {
    content?: string
    score?: string
    postId: string
    commentId: string
  }) => {
    dispatch(
      editComment({
        content,
        score,
        postId,
        commentId,
      }),
    )
  }

  const editReplyDispatcher = ({
    content,
    score,
    postId,
    commentId,
    replyId,
  }: {
    content?: string
    score?: string
    postId: string
    commentId: string
    replyId: string
  }) => {
    dispatch(
      editReply({
        content,
        score,
        postId,
        commentId,
        replyId,
      }),
    )
  }

  const SingleCommentReply = ({
    reply,
    commentId,
    setReplyReplyInputOpen,
    replyReplyInputTextareaRef,
  }: {
    reply: Reply
    commentId: string
    setReplyReplyInputOpen: React.Dispatch<React.SetStateAction<boolean>>
    replyReplyInputTextareaRef: React.RefObject<HTMLTextAreaElement>
  }) => {
    const repliedTo = useAppSelector((state) =>
      selectUserById(state, reply.repliedTo),
    )
    const [isEditing, setIsEditing] = useState(false)
    const [textareaValue, setTextareaValue] = useState(reply.content)

    return (
      <div className={styles.commentContainer}>
        <div className={styles.commentBody}>
          <PlusMinusInput
            score={Number(reply.score)}
            onPlusMinusClickHandler={(valueToIncrement) =>
              editReplyDispatcher({
                score: String(reply.score + valueToIncrement),
                postId: post._id,
                commentId: commentId,
                replyId: reply._id,
              })
            }
          />
          <div className={styles.userLabelAndContentContainer}>
            <div className={styles.postAuthorImgNameTimeAgo}>
              <img
                src={`/images/avatars/${reply.author.image.webp}`}
                alt="author"
              />
              <span className={styles.userName}>{reply.author.userName}</span>
              <YouLabel entity={reply} currentUser={currentUser} />
              <TimeAgo timestamp={reply.createdAt} />
              {reply.author._id !== currentUser ? (
                <ReplyBtn
                  textareaToFocus={replyReplyInputTextareaRef}
                  inputOpenSet={setReplyReplyInputOpen}
                  authorId={reply.author._id}
                />
              ) : (
                <DeleteEditBtns
                  onDeleteClicked={() => {
                    dispatch(
                      deleteReply({
                        postId: post._id,
                        commentId: commentId,
                        replyId: reply._id,
                      }),
                    )
                  }}
                  onEditClicked={() => {
                    setIsEditing(!isEditing)
                  }}
                />
              )}
            </div>
            {!isEditing ? (
              <div className={styles.contentContainer}>
                <p className={styles.content}>
                  <span className={styles.replyAuthorReference}>
                    @{repliedTo.userName} &nbsp;
                  </span>
                  {reply.content}
                </p>
              </div>
            ) : (
              <EditInput
                entityValue={reply.content}
                textareaValue={textareaValue}
                setTextareaValue={setTextareaValue}
                setIsEditing={setIsEditing}
                onUpdate={() => {
                  dispatch(
                    editReply({
                      content: textareaValue,
                      postId: post._id,
                      commentId: commentId,
                      replyId: reply._id,
                    }),
                  )
                }}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  const SingleComment = ({ comment }: { comment: Comment }) => {
    const [commentReplyInputOpen, setCommentReplyInputOpen] =
      useState<boolean>(false)
    const [replyReplyInputOpen, setReplyReplyInputOpen] =
      useState<boolean>(false)
    const commentReplyInputTextareaRef = useRef(null)
    const replyReplyInputTextareaRef = useRef(null)
    const [isEditing, setIsEditing] = useState(false)
    const [textareaValue, setTextareaValue] = useState(comment.content)

    return (
      <div className={styles.commentContainer}>
        <div className={styles.commentBody}>
          <PlusMinusInput
            score={Number(comment.score)}
            onPlusMinusClickHandler={(valueToIncrement) =>
              editCommentDispatcher({
                score: String(comment.score + valueToIncrement),
                postId: post._id,
                commentId: comment._id,
              })
            }
          />
          <div className={styles.userLabelAndContentContainer}>
            <div className={styles.postAuthorImgNameTimeAgo}>
              <img
                src={`/images/avatars/${comment.author.image.webp}`}
                alt="author"
              />
              <span className={styles.userName}>{comment.author.userName}</span>
              <YouLabel entity={comment} currentUser={currentUser} />
              <TimeAgo timestamp={comment.createdAt} />
              {comment.author._id !== currentUser ? (
                <ReplyBtn
                  textareaToFocus={commentReplyInputTextareaRef}
                  inputOpenSet={setCommentReplyInputOpen}
                  authorId={comment.author._id}
                />
              ) : (
                <DeleteEditBtns
                  onDeleteClicked={() => {
                    dispatch(
                      deleteComment({
                        postId: post._id,
                        commentId: comment._id,
                      }),
                    )
                  }}
                  onEditClicked={() => {
                    setIsEditing(!isEditing)
                  }}
                />
              )}
            </div>
            {!isEditing ? (
              <div className={styles.contentContainer}>
                <p className={styles.content}>{comment.content}</p>
              </div>
            ) : (
              <EditInput
                entityValue={comment.content}
                textareaValue={textareaValue}
                setTextareaValue={setTextareaValue}
                setIsEditing={setIsEditing}
                onUpdate={() => {
                  dispatch(
                    editComment({
                      content: textareaValue,
                      postId: post._id,
                      commentId: comment._id,
                    }),
                  )
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.repliesContainer}>
          {comment.replies.map((reply: Reply) => {
            return (
              <SingleCommentReply
                key={reply._id}
                reply={reply}
                commentId={comment._id}
                setReplyReplyInputOpen={setReplyReplyInputOpen}
                replyReplyInputTextareaRef={replyReplyInputTextareaRef}
              />
            )
          })}
          {replyReplyInputOpen && (
            <ReplyInput
              placeholder="Add a reply"
              textareaRef={replyReplyInputTextareaRef}
              btnText="REPLY"
              onClickOutside={() => setReplyReplyInputOpen(false)}
              onSendClick={(content: string) =>
                dispatch(
                  addReply({
                    postId: post._id,
                    commentId: comment._id,
                    content: content,
                    author: currentUser,
                    repliedTo: authorIdToReplyTo.current,
                  }),
                )
              }
            />
          )}
        </div>
        {commentReplyInputOpen && (
          <ReplyInput
            placeholder="Add a reply"
            textareaRef={commentReplyInputTextareaRef}
            btnText="REPLY"
            onClickOutside={() => setCommentReplyInputOpen(false)}
            onSendClick={(content: string) =>
              dispatch(
                addReply({
                  postId: post._id,
                  commentId: comment._id,
                  content: content,
                  author: currentUser,
                  repliedTo: authorIdToReplyTo.current,
                }),
              )
            }
          />
        )}
      </div>
    )
  }

  // const YouLabel = ({ entity }: { entity: { author: Author } }) => {
  //   return entity.author._id === currentUser ? (
  //     <div className={styles.youLabelContainer}>
  //       <span className={styles.youLabel}>you</span>
  //     </div>
  //   ) : null
  // }

  const ReplyBtn = ({
    inputOpenSet,
    textareaToFocus,
    authorToReplyToSet,
    authorId,
    style,
  }: {
    inputOpenSet?: React.Dispatch<React.SetStateAction<boolean>>
    textareaToFocus: React.RefObject<HTMLTextAreaElement>
    authorToReplyToSet?: React.Dispatch<React.SetStateAction<string>>
    authorId?: string
    style?: React.CSSProperties | undefined
  }) => {
    return (
      <div
        className={styles.replyBtn}
        onClick={async () => {
          if (authorId) authorIdToReplyTo.current = authorId
          inputOpenSet && (await inputOpenSet(true))
          sendCommentTextAreaFocus(textareaToFocus)
        }}
        style={style}
      >
        <span className={styles.replyIcon}></span>
        <span>Reply</span>
      </div>
    )
  }

  const DeleteEditBtns = ({
    onDeleteClicked,
    onEditClicked,
  }: {
    onDeleteClicked: () => void
    onEditClicked: () => void
  }) => {
    return (
      <div className={styles.deleteEditBtnsContainer}>
        <div className={styles.deleteBtn} onClick={onDeleteClicked}>
          <span className={styles.deleteIcon}></span>
          <span>Delete</span>
        </div>
        <div className={styles.editBtn} onClick={onEditClicked}>
          <span className={styles.editIcon}></span>
          <span>Edit</span>
        </div>
      </div>
    )
  }

  const postsFetchStatus = useAppSelector((state) => state.posts.status)
  useEffect(() => {
    if (postsFetchStatus === "idle") dispatch(fetchPosts())
    if (post && post.content) setTextareaValue(post.content)
  }, [post, dispatch, postsFetchStatus])
  if (post) {
    return (
      <div className={styles.postContainer}>
        <div className={styles.postBody}>
          <PlusMinusInput
            score={Number(post.score)}
            onPlusMinusClickHandler={(valueToIncrement) =>
              editPostDispatcher({
                score: String(post.score + valueToIncrement),
                postId: post._id,
              })
            }
          />
          <div className={styles.userLabelAndContentContainer}>
            <div className={styles.postAuthorImgNameTimeAgo}>
              <img
                src={`/images/avatars/${post.author.image.webp}`}
                alt="author"
              />
              <span className={styles.userName}>{post.author.userName}</span>
              <YouLabel entity={post} currentUser={currentUser} />
              <TimeAgo timestamp={post.createdAt} />
              {post.author._id === currentUser && (
                <DeleteEditBtns
                  onDeleteClicked={() => {
                    dispatch(
                      deletePost({
                        postId: post._id,
                      }),
                    )
                    navigate("/posts")
                  }}
                  onEditClicked={() => {
                    setIsEditing(!isEditing)
                  }}
                />
              )}
              <ReplyBtn
                textareaToFocus={postReplyInputTextareaRef}
                style={
                  post.author._id === currentUser
                    ? { marginLeft: "10px" }
                    : { marginLeft: "auto" }
                }
              />
            </div>
            {!isEditing ? (
              <>
                <p className={styles.content}>{post.content}</p>
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
          </div>
        </div>

        <div className={styles.commentsContainer}>
          {post.comments.map((comment: Comment) => (
            <SingleComment key={comment._id} comment={comment} />
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
    )
  } else return <p>Post not found</p>
}
