import { useAppSelector } from "../../app/hooks"
import styles from "./Posts.module.scss"

const sendCommentTextAreaFocus = (ref: any) => {
  ref.current && ref.current.focus()
}

export const ReplyBtn = ({
  authorIdToReplyTo,
  inputOpenSet,
  textareaToFocus,
  authorId,
  style,
}: {
  authorIdToReplyTo: React.MutableRefObject<string>
  inputOpenSet?: React.Dispatch<React.SetStateAction<boolean>>
  textareaToFocus: React.RefObject<HTMLTextAreaElement>
  authorId?: string
  style?: React.CSSProperties | undefined
}) => {
  const currentUser = useAppSelector((state) => state.users.currentUser)

  return (
    <div
      data-testid="postReplyBtn"
      className={styles.replyBtn}
      onClick={async () => {
        if (!currentUser) return

        if (authorId) authorIdToReplyTo.current = authorId
        inputOpenSet && (await inputOpenSet(true))
        sendCommentTextAreaFocus(textareaToFocus)
      }}
      style={{ ...style, ...{ cursor: !currentUser ? "default" : "pointer" } }}
    >
      <span
        style={{
          backgroundImage: !currentUser
            ? "url(/images/icon-reply-hovered.svg)"
            : "",
        }}
        className={styles.replyIcon}
      ></span>
      <span
        style={{
          color: !currentUser ? "hsl(239, 57%, 85%)" : "",
        }}
      >
        Reply
      </span>
    </div>
  )
}
