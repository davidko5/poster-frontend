import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReplyInput } from "../ReplyInput"
import { useRef } from "react"
import { Provider } from "react-redux"
import { store } from "../../../app/store"

describe("<ReplyInput />", () => {
  // Wrapper component to handle the ref
  const ReplyInputWrapper: React.FC<{
    onSendClick: (content: string) => void
  }> = ({ onSendClick }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    return (
      <Provider store={store}>
        <ReplyInput
          placeholder="Add a comment"
          textareaRef={textareaRef}
          btnText="SEND"
          onSendClick={onSendClick}
        />
      </Provider>
    )
  }

  test("tests callback fn to be called once with right argument", async () => {
    const submitReply = vi.fn()
    render(<ReplyInputWrapper onSendClick={submitReply} />)

    const user = userEvent.setup()
    const textarea = screen.getByTestId("replyInputTextarea")
    const submitBtn = screen.getByText("SEND")

    await user.type(textarea, "reply text")
    await user.click(submitBtn)

    expect(submitReply.mock.calls).toHaveLength(1)
    expect(submitReply.mock.calls[0][0]).toBe("reply text")
  })
})
