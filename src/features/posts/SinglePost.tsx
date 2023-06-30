import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./Posts.module.scss"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchPosts,
  editPost,
  editComment,
  editReply,
  postReply,
  selectPostById,
} from "./postsSlice"
import { EntityId } from "@reduxjs/toolkit"
import { PlusMinusInput } from "./PlusMinusInput"
import { TimeAgo } from "./TimeAgo"
import { ReplyInput } from "./ReplyInput"
import {} from "./postsSlice"

interface Author {
  _id: string
  userName: string
  createdAt: string
  updatedAt: string
  image: {
    png: string
    webp: string
  }
}

interface Comment {
  _id: string
  content: string
  score: number
  author: Author
  createdAt: string
  updatedAt: string
  replies: Array<Reply>
}

interface Reply {
  _id: string
  content: string
  score: number
  author: Author
  createdAt: string
  updatedAt: string
}

export const SinglePost = () => {
  const id = useParams()["id"]
  const dispatch = useAppDispatch()
  const post = useAppSelector((state) => selectPostById(state, id as EntityId))
  const currentUser = useAppSelector((state) => state.users.currentUser)
  const postReplyInputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const sendCommentTextAreaFocus = (ref: any) => {
    ref.current && ref.current.focus()
  }

  const onCommentReplyClick = (comment: Comment) => {
    dispatch(
      postReply({
        content: "Some example reply",
        postId: post._id,
        commentId: comment._id,
        currentUser,
      }),
    )
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
              <YouLabel entity={reply} />
              <TimeAgo timestamp={reply.createdAt} />
              {reply.author._id !== currentUser && (
                <ReplyBtn
                  textareaToFocus={replyReplyInputTextareaRef}
                  inputOpenSet={setReplyReplyInputOpen}
                />
              )}
            </div>
            <div className={styles.contentContainer}>
              <p className={styles.content}>
                <span className={styles.replyAuthorReference}>
                  @ramsesmiron&nbsp;
                </span>
                {reply.content}
              </p>
            </div>
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
              <YouLabel entity={comment} />
              <TimeAgo timestamp={comment.createdAt} />
              {comment.author._id !== currentUser ? (
                <ReplyBtn
                  textareaToFocus={commentReplyInputTextareaRef}
                  inputOpenSet={setCommentReplyInputOpen}
                />
              ) : (
                <DeleteEditBtns />
              )}
            </div>
            <div className={styles.contentContainer}>
              <p className={styles.content}>{comment.content}</p>
            </div>
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
              textareaRef={replyReplyInputTextareaRef}
              onClickOutside={() => setReplyReplyInputOpen(false)}
            />
          )}
        </div>
        {commentReplyInputOpen && (
          <ReplyInput
            textareaRef={commentReplyInputTextareaRef}
            onClickOutside={() => setCommentReplyInputOpen(false)}
          />
        )}
      </div>
    )
  }

  const YouLabel = ({ entity }: { entity: { author: Author } }) => {
    return entity.author._id === currentUser ? (
      <div className={styles.youLabelContainer}>
        <span className={styles.youLabel}>you</span>
      </div>
    ) : null
  }

  const ReplyBtn = ({
    inputOpenSet,
    textareaToFocus,
  }: {
    inputOpenSet?: React.Dispatch<React.SetStateAction<boolean>>
    textareaToFocus: React.RefObject<HTMLTextAreaElement>
  }) => {
    return (
      <div
        className={styles.replyBtn}
        onClick={async () => {
          inputOpenSet && (await inputOpenSet(true))
          sendCommentTextAreaFocus(textareaToFocus)
        }}
      >
        <span className={styles.replyIcon}></span>
        <span>Reply</span>
      </div>
    )
  }

  const DeleteEditBtns = () => {
    return (
      <div>
        <div className={styles.deleteBtn} onClick={() => console.log("del")}>
          <span className={styles.deleteIcon}></span>
          <span>Delete</span>
        </div>
        <div className={styles.editBtn} onClick={() => console.log("edi")}>
          <span className={styles.editIcon}></span>
          <span>Edit</span>
        </div>
      </div>
    )
  }

  const postsFetchStatus = useAppSelector((state) => state.posts.status)
  useEffect(() => {
    if (postsFetchStatus === "idle") dispatch(fetchPosts())
  })
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
              <YouLabel entity={post} />
              <TimeAgo timestamp={post.createdAt} />
              <ReplyBtn textareaToFocus={postReplyInputTextareaRef} />
            </div>
            <h2>{post.title}</h2>
            <p className={styles.content}>{post.content}</p>
          </div>
        </div>

        <div className={styles.commentsContainer}>
          {post.comments.map((comment: Comment) => (
            <SingleComment key={comment._id} comment={comment} />
          ))}
        </div>
        <ReplyInput textareaRef={postReplyInputTextareaRef} />
      </div>
    )
  } else return <p>Post not found</p>
}
