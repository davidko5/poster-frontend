import { useRef, useState } from "react"
import styles from "./Posts.module.scss"
import { Comment, Reply } from "../../types"
import { PlusMinusInput } from "./PlusMinusInput"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addReply, deleteComment, editComment } from "./postsSlice"
import { YouLabel } from "../components/YouLabel"
import { TimeAgo } from "./TimeAgo"
import { ReplyBtn } from "./ReplyBtn"
import { EditInput } from "./EditInput"
import { ReplyInput } from "./ReplyInput"
import { DeleteModal } from "../components/DeleteModal"
import { DeleteEditBtns } from "./DeleteEditBtns"
import { CommentReply } from "./CommentReply"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const CommentComponent = ({
  postId,
  comment,
  authorIdToReplyTo,
  windowSize,
}: {
  postId: string
  comment: Comment
  authorIdToReplyTo: React.MutableRefObject<string>
  windowSize: {
    width: number
    height: number
  }
}) => {
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state) => state.users.currentUser)
  const [commentReplyInputOpen, setCommentReplyInputOpen] =
    useState<boolean>(false)
  const [replyReplyInputOpen, setReplyReplyInputOpen] = useState<boolean>(false)
  const commentReplyInputTextareaRef = useRef(null)
  const replyReplyInputTextareaRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [textareaValue, setTextareaValue] = useState(comment.content)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  const editCommentDispatcher = ({
    content,
    score,
    commentId,
  }: {
    content?: string
    score?: string
    commentId: string
  }) => {
    if (postId) {
      dispatch(
        editComment({
          content,
          score,
          postId: postId,
          commentId,
        }),
      )
    }
  }

  return (
    <>
      <div data-testid="postComment" className={styles.commentContainer}>
        <div className={styles.commentBody}>
          {window.innerWidth > 900 && (
            <PlusMinusInput
              score={Number(comment.score)}
              onPlusMinusClickHandler={(valueToIncrement) =>
                editCommentDispatcher({
                  score: String(comment.score + valueToIncrement),
                  commentId: comment._id,
                })
              }
            />
          )}
          <div className={styles.userLabelAndContentContainer}>
            <div className={styles.postAuthorImgNameTimeAgo}>
              <img
                src={`${frontendBaseUrl}/images/avatars/${comment.author.image.webp}`}
                alt="author"
              />
              <span className={styles.userName}>{comment.author.userName}</span>
              <YouLabel entity={comment} currentUser={currentUser} />
              <TimeAgo timestamp={comment.createdAt} />
              {window.innerWidth > 900 &&
                (comment.author._id !== currentUser ? (
                  <ReplyBtn
                    authorIdToReplyTo={authorIdToReplyTo}
                    textareaToFocus={commentReplyInputTextareaRef}
                    inputOpenSet={setCommentReplyInputOpen}
                    authorId={comment.author._id}
                  />
                ) : (
                  <DeleteEditBtns
                    onDeleteClicked={() => {
                      setDeleteModalOpened(true)
                    }}
                    onEditClicked={() => {
                      setIsEditing(!isEditing)
                    }}
                  />
                ))}
            </div>
            {!isEditing ? (
              <div data-testid="content" className={styles.contentContainer}>
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
                      postId,
                      commentId: comment._id,
                    }),
                  )
                  setIsEditing(false)
                }}
              />
            )}
            <div className={styles.plusMinusDeleteEditReplyReplacedContainer}>
              {windowSize.width < 900 && (
                <PlusMinusInput
                  score={Number(comment.score)}
                  onPlusMinusClickHandler={(valueToIncrement) =>
                    editCommentDispatcher({
                      score: String(comment.score + valueToIncrement),
                      commentId: comment._id,
                    })
                  }
                />
              )}
              {window.innerWidth < 900 &&
                (comment.author._id !== currentUser ? (
                  <ReplyBtn
                    authorIdToReplyTo={authorIdToReplyTo}
                    textareaToFocus={commentReplyInputTextareaRef}
                    inputOpenSet={setCommentReplyInputOpen}
                    authorId={comment.author._id}
                  />
                ) : (
                  <DeleteEditBtns
                    onDeleteClicked={() => {
                      setDeleteModalOpened(true)
                    }}
                    onEditClicked={() => {
                      setIsEditing(!isEditing)
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className={styles.repliesContainer}>
          {comment.replies.map((reply: Reply) => {
            return (
              <CommentReply
                postId={postId}
                authorIdToReplyTo={authorIdToReplyTo}
                key={reply._id}
                reply={reply}
                commentId={comment._id}
                setReplyReplyInputOpen={setReplyReplyInputOpen}
                replyReplyInputTextareaRef={replyReplyInputTextareaRef}
                windowSize={windowSize}
              />
            )
          })}
          {replyReplyInputOpen && (
            <ReplyInput
              placeholder="Add a reply"
              textareaRef={replyReplyInputTextareaRef}
              btnText="REPLY"
              onClickOutside={() => setReplyReplyInputOpen(false)}
              onSendClick={(content: string) => {
                dispatch(
                  addReply({
                    postId,
                    commentId: comment._id,
                    content: content,
                    author: currentUser,
                    repliedTo: authorIdToReplyTo.current,
                  }),
                )
                setReplyReplyInputOpen(false)
              }}
            />
          )}
        </div>
        {commentReplyInputOpen && (
          <ReplyInput
            placeholder="Add a reply"
            textareaRef={commentReplyInputTextareaRef}
            btnText="REPLY"
            onClickOutside={() => setCommentReplyInputOpen(false)}
            onSendClick={(content: string) => {
              dispatch(
                addReply({
                  postId,
                  commentId: comment._id,
                  content: content,
                  author: currentUser,
                  repliedTo: authorIdToReplyTo.current,
                }),
              )
              setCommentReplyInputOpen(false)
            }}
          />
        )}
      </div>
      {deleteModalOpened && (
        <DeleteModal
          setModalOpened={setDeleteModalOpened}
          onConfirmation={() => {
            dispatch(
              deleteComment({
                postId: postId,
                commentId: comment._id,
              }),
            )
          }}
          titleText="Delete comment"
          cancelBtnText="NO, CANCEL"
          confirmBtnText="YES, DELETE"
        />
      )}
    </>
  )
}
