import React, { useRef, useEffect } from "react"
import styles from "./Posts.module.scss"

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

const refFocus = (ref: any) => {
  ref.current && ref.current.focus()
}

export const EditInput = ({
  entityValue,
  textareaValue,
  setTextareaValue,
  setIsEditing,
  onUpdate,
}: {
  entityValue: string
  textareaValue: string
  setTextareaValue: React.Dispatch<React.SetStateAction<string>>
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  onUpdate: () => void
}) => {
  const editInputContainerRef = useRef(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useOutsideAlerter(editInputContainerRef, () => {
    setIsEditing(false)
    setTextareaValue(entityValue)
  })

  const ctrlEnterConfirmation = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.ctrlKey) {
      onUpdate && onUpdate()
      textareaRef.current && textareaRef.current.blur()
    }
  }

  useEffect(() => {
    //setting caret at the end of textarea input before focusing
    textareaRef.current &&
      textareaRef.current.setSelectionRange(
        textareaValue.length,
        textareaValue.length,
      )
    refFocus(textareaRef)
  })

  return (
    <div className={styles.editingContainer} ref={editInputContainerRef}>
      <textarea
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        placeholder="Add a reply"
        onKeyDown={ctrlEnterConfirmation}
        ref={textareaRef}
      ></textarea>
      <div
        className={styles.editingUpdateBtn}
        onClick={() => {
          onUpdate()
        }}
      >
        <span>UPDATE</span>
      </div>
    </div>
  )
}
