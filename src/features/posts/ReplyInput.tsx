import React, { useEffect, useRef } from "react"
import styles from "./Posts.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../users/usersSlice"

function useOutsideAlerter(
  ref: React.RefObject<HTMLTextAreaElement>,
  onClickOutside?: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

export const ReplyInput = ({
  textareaRef,
  onClickOutside,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onClickOutside?: () => void
}) => {
  const currentUserId = useAppSelector((state) => state.users.currentUser)
  const currentUser = useAppSelector((state) =>
    selectUserById(state, currentUserId),
  )
  const componentContainerRef = useRef(null)
  useOutsideAlerter(componentContainerRef, onClickOutside)

  return (
    <div className={styles.replyInputContainer} ref={componentContainerRef}>
      <img src={`/images/avatars/${currentUser.image.png}`} alt="author" />
      <textarea ref={textareaRef}></textarea>
      <div className={styles.replyInputSendBtn}>
        <span>SEND</span>
      </div>
    </div>
  )
}
