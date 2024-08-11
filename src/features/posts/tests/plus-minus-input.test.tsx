import { render, screen } from "@testing-library/react"
import { PlusMinusInput } from "../PlusMinusInput"
import userEvent from "@testing-library/user-event"

const INITIAL_SCORE = 0

describe("PlusMinusInput", () => {
  const renderComponent = () =>
    render(
      <PlusMinusInput
        score={INITIAL_SCORE}
        onPlusMinusClickHandler={() => {}}
      />,
    )
  test("tests plus minus input", () => {
    renderComponent()
    screen.getByText(INITIAL_SCORE.toString())
  })

  test("renders plus minus container", () => {
    renderComponent()

    const element = screen.getByTestId("scoreContainer")
    expect(element).toHaveTextContent(INITIAL_SCORE.toString())
  })

  test("tests components buttons click calls callback once", async () => {
    const mockHandler = vi.fn()

    render(
      <PlusMinusInput
        score={INITIAL_SCORE}
        onPlusMinusClickHandler={mockHandler}
      />,
    )

    const user = userEvent.setup()
    const plusBtn = screen.getByTestId("plusContainer")
    const minusBtn = screen.getByTestId("minusContainer")
    await user.click(plusBtn)
    await user.click(minusBtn)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  // test("tests components icon to have style", () => {
  //   renderComponent()

  //   const plusIconContainer = screen.getByTestId("plusContainer")
  //   expect(plusIconContainer).not.toHaveStyle("cursor: pointer")

  //   const user = userEvent.setup()
  //   userEvent.hover(plusIconContainer)
  //   const plusIconContainerHovered = screen.getByTestId("plusContainer")

  //   expect(plusIconContainerHovered).toHaveStyle("cursor: pointer")
  // })
})
