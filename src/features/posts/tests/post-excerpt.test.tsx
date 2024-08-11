import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { PostExcerpt } from "../PostExcerpt"
import { store } from "../../../app/store"

test("renders content", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <PostExcerpt postId={"668c6252801d043469d3abba"} currentUser="" />
      </BrowserRouter>
    </Provider>,
  )

  const element = screen.getByText("Post isn't yet fetched")
  expect(element).toBeDefined()
})
