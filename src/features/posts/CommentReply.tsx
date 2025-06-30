import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Reply } from "../../types"
import { selectUserById } from "../users/usersSlice"
import styles from "./Posts.module.scss"
import { PlusMinusInput } from "./PlusMinusInput"
import { deleteReply, editReply } from "./postsSlice"
import { YouLabel } from "../components/YouLabel"
import { TimeAgo } from "./TimeAgo"
import { ReplyBtn } from "./ReplyBtn"
import { DeleteEditBtns } from "./DeleteEditBtns"
import { EditInput } from "./EditInput"
import { DeleteModal } from "../components/DeleteModal"
import { getPublicUserNamePlaceholder } from "../../utils/miscellaneous"

const frontendBaseUrl = import.meta.env.VITE_BASE_URL

export const CommentReply = ({
  postId,
  authorIdToReplyTo,
  reply,
  commentId,
  setReplyReplyInputOpen,
  replyReplyInputTextareaRef,
  windowSize,
}: {
  postId: string
  authorIdToReplyTo: React.MutableRefObject<string>
  reply: Reply
  commentId: string
  setReplyReplyInputOpen: React.Dispatch<React.SetStateAction<boolean>>
  replyReplyInputTextareaRef: React.RefObject<HTMLTextAreaElement>
  windowSize: {
    width: number
    height: number
  }
}) => {
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state) => state.users.currentUser)
  const repliedTo = useAppSelector((state) =>
    selectUserById(state, reply.repliedTo),
  )

  const [isEditing, setIsEditing] = useState(false)
  const [textareaValue, setTextareaValue] = useState(reply.content)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  const editReplyDispatcher = ({
    content,
    score,
    commentId,
    replyId,
  }: {
    content?: string
    score?: string
    commentId: string
    replyId: string
  }) => {
    if (postId) {
      dispatch(
        editReply({
          content,
          score,
          postId: postId,
          commentId,
          replyId,
        }),
      )
    }
  }

  const author = useAppSelector((state) =>
    selectUserById(state, reply.authorId),
  )

  return (
    <>
      <div data-testid="commentReply" className={styles.commentContainer}>
        <div className={styles.commentBody}>
          {windowSize.width > 900 && (
            <PlusMinusInput
              disabled={!currentUser}
              score={Number(reply.score)}
              onPlusMinusClickHandler={(valueToIncrement) =>
                editReplyDispatcher({
                  score: String(reply.score + valueToIncrement),
                  commentId: commentId,
                  replyId: reply._id,
                })
              }
            />
          )}
          <div className={styles.userLabelAndContentContainer}>
            <div className={styles.postAuthorImgNameTimeAgo}>
              {/* <img
                src={`${frontendBaseUrl}/images/avatars/${reply.author.image.webp}`}
                alt="author"
              /> */}
              <img
                src={`${frontendBaseUrl}/images/profile-image-placeholder.png`}
                alt="author"
              />
              <span className={styles.userName}>
                {author?.name || getPublicUserNamePlaceholder(reply.authorId)}
              </span>
              {currentUser && (
                <YouLabel
                  authorId={reply.authorId}
                  currentUserId={currentUser.id}
                />
              )}
              <TimeAgo timestamp={reply.createdAt} />
              {window.innerWidth > 900 &&
                (reply.authorId !== currentUser?.id ? (
                  <ReplyBtn
                    authorIdToReplyTo={authorIdToReplyTo}
                    textareaToFocus={replyReplyInputTextareaRef}
                    inputOpenSet={setReplyReplyInputOpen}
                    authorId={reply.authorId}
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
              <div className={styles.contentContainer}>
                <p data-testid="content" className={styles.content}>
                  <span className={styles.replyAuthorReference}>
                    @
                    {repliedTo?.name ||
                      getPublicUserNamePlaceholder(reply.repliedTo)}{" "}
                    &nbsp;
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
                      postId,
                      commentId: commentId,
                      replyId: reply._id,
                    }),
                  )
                  setIsEditing(false)
                }}
              />
            )}
            <div className={styles.plusMinusDeleteEditReplyReplacedContainer}>
              {windowSize.width < 900 && (
                <PlusMinusInput
                  disabled={!currentUser}
                  score={Number(reply.score)}
                  onPlusMinusClickHandler={(valueToIncrement) =>
                    editReplyDispatcher({
                      score: String(reply.score + valueToIncrement),
                      commentId: commentId,
                      replyId: reply._id,
                    })
                  }
                />
              )}
              {window.innerWidth < 900 &&
                (reply.authorId !== currentUser?.id ? (
                  <ReplyBtn
                    authorIdToReplyTo={authorIdToReplyTo}
                    textareaToFocus={replyReplyInputTextareaRef}
                    inputOpenSet={setReplyReplyInputOpen}
                    authorId={reply.authorId}
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
      </div>
      {deleteModalOpened && (
        <DeleteModal
          setModalOpened={setDeleteModalOpened}
          onConfirmation={() => {
            if (postId) {
              dispatch(
                deleteReply({
                  postId,
                  commentId: commentId,
                  replyId: reply._id,
                }),
              )
            }
          }}
          titleText="Delete reply"
          cancelBtnText="NO, CANCEL"
          confirmBtnText="YES, DELETE"
        />
      )}
    </>
  )
}
