import React, { useEffect, useRef, useState } from "react"
import styles from "./Posts.module.scss"
import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../users/usersSlice"
import { useOutsideAlerter } from "../../utils/useOutsideAlerter"
import { UserAvatar } from "../components/UserAvatar"

interface ReplyInputProps {
  placeholder: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  btnText: string
  onClickOutside?: () => void
  onSendClick?: (content: string) => void
  disabled?: boolean
}

export const ReplyInput = (props: ReplyInputProps) => {
  const {
    placeholder,
    textareaRef,
    btnText,
    onClickOutside,
    onSendClick,
    disabled = false,
  } = props

  const currentUser = useAppSelector((state) => state.users.currentUser)
  const [textareaValue, setTextareaValue] = useState("")
  const componentContainerRef = useRef(null)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const ctrlEnterConfirmation = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.ctrlKey) {
      onSendClick && onSendClick(textareaValue)
      setTextareaValue("")
      textareaRef.current && textareaRef.current.blur()
    }
  }

  useOutsideAlerter(componentContainerRef, onClickOutside)

  const handleConfirmation = () => {
    if (disabled) return

    onSendClick && onSendClick(textareaValue)
    setTextareaValue("")
  }

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <div
      data-testid="replyInput"
      className={styles.replyInputContainer}
      ref={componentContainerRef}
    >
      {windowSize.width > 600 && (
        <UserAvatar userId={currentUser?.id ?? "?"} size={36} />
      )}
      <textarea
        data-testid="replyInputTextarea"
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        ref={textareaRef}
        placeholder={placeholder}
        onKeyDown={ctrlEnterConfirmation}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
        disabled={disabled}
      />
      {windowSize.width > 600 && (
        <div
          data-testid="replyInputBtn"
          className={styles.replyInputBtn}
          onClick={handleConfirmation}
          style={{
            backgroundColor: disabled ? "hsl(243, 100%, 86%)" : "",
            cursor: disabled ? "default" : "pointer",
          }}
        >
          <span>{btnText}</span>
        </div>
      )}
      {windowSize.width < 600 && (
        <div className={styles.imageConfirmBtn}>
          <UserAvatar userId={currentUser?.id ?? "?"} size={36} />
          <div
            className={styles.replyInputBtn}
            onClick={handleConfirmation}
            style={{
              backgroundColor: disabled ? "hsl(243, 100%, 86%)" : "",
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <span>{btnText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
