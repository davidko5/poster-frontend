import { expect, Locator, Page } from "@playwright/test"

export const addPost = async (page: Page, content: string) => {
  await page.getByRole("button").click()
  await page.getByTestId("addPostTextarea").fill(content)
  await page.getByRole("button", { name: "ADD POST" }).click()
  await page.getByText(content).waitFor()
}

export const addComment = async (page: Page, content: string) => {
  await page.getByTestId("postReplyBtn").click()
  await page
    .getByTestId("replyInput")
    .getByTestId("replyInputTextarea")
    .fill(content)
  await page.getByTestId("replyInput").getByTestId("replyInputBtn").click()

  await page.getByTestId("postComment").getByText(content).waitFor()
}

export const addReply = async (page: Page, content: string) => {
  const comment = page.getByTestId("postComment")
  await page.getByTestId("userSelect").selectOption({ label: "ramsesmiron" })

  await comment.getByTestId("postReplyBtn").click()
  await comment
    .getByTestId("replyInput")
    .getByTestId("replyInputTextarea")
    .fill(content)
  await comment.getByTestId("replyInput").getByTestId("replyInputBtn").click()

  await comment.getByTestId("commentReply").getByText(content)
}

export const entryCanBeRated = async (entry: Locator | Page) => {
  await expect(entry.getByTestId("scoreContainer")).toContainText("0")

  for (let i = 1; i <= 3; i++) {
    await entry.getByTestId("plusContainer").click()
    await entry.getByTestId("scoreContainer").getByText(`${i}`).waitFor()
  }
  await expect(entry.getByTestId("scoreContainer")).toContainText("3")

  for (let i = 3; i >= -1; i--) {
    await entry.getByTestId("minusContainer").click()
    await entry
      .getByTestId("scoreContainer")
      .getByText(`${i - 1}`)
      .waitFor()
  }
  await expect(entry.getByTestId("scoreContainer")).toContainText("-2")
}

export const entryCanBeDeleted = async (page: Page, entry: Locator) => {
  await entry.getByTestId("deleteBtn").click()
  await page.getByTestId("deleteModalConfirmationBtn").click()
  await expect(entry).not.toBeVisible()
}

export const entryCanBeEdited = async (entry: Locator, content: string) => {
  await entry.getByTestId("editBtn").click()
  await entry.getByTestId("editInput").fill(content)
  await entry.getByTestId("editInputUpdateBtn").click()

  await expect(entry.getByTestId("content")).toContainText(content)
}
