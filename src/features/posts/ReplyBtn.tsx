import styles from "./Posts.module.scss"

const sendCommentTextAreaFocus = (ref: any) => {
  ref.current && ref.current.focus()
}

export const ReplyBtn = ({
  authorIdToReplyTo,
  inputOpenSet,
  textareaToFocus,
  authorToReplyToSet,
  authorId,
  style,
}: {
  authorIdToReplyTo: React.MutableRefObject<string>
  inputOpenSet?: React.Dispatch<React.SetStateAction<boolean>>
  textareaToFocus: React.RefObject<HTMLTextAreaElement>
  authorToReplyToSet?: React.Dispatch<React.SetStateAction<string>>
  authorId?: string
  style?: React.CSSProperties | undefined
}) => {
  return (
    <div
      data-testid="postReplyBtn"
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
