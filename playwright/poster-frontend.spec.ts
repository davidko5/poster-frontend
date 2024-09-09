import { test, expect, Locator } from "@playwright/test"
import {
  addComment,
  addPost,
  addReply,
  entryCanBeDeleted,
  entryCanBeEdited,
  entryCanBeRated,
} from "./helper"

const { describe, beforeEach } = test

const postContent = "A post created by playwright"
const secondPostContent = "A second post created by playwright"
const postContentEdited = "Edited post contend"
const commentContent = "A comment added by playwright"
const commentContentEdited = "Edited comment content"
const replyContent = "A reply added by playwright"
const replyContentEdited = "Edited reply content"

describe("Poster Frontend", () => {
  beforeEach(async ({ page, request }) => {
    // Resetting(clearing) posts collection at database
    await request.post("http://localhost:3001/test/reset")
    await page.goto("http://localhost:5173")
  })

  test("Front page can be opened", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Poster" }),
    ).toBeVisible()
    await expect(
      page.getByText("Made using React, Redux, Express and MongoDB"),
    ).toBeVisible()
  })

  test("'No posts' modal is visible and has hover style applied", async ({
    page,
  }) => {
    const modal = page.getByTestId("noPostsModal")
    await expect(modal).toHaveCSS(
      "box-shadow",
      "rgb(103, 114, 126) 0px 0px 15px 0px",
    )
    await modal.hover()
    await expect(modal).toHaveCSS(
      "box-shadow",
      "rgb(103, 114, 126) 0px 0px 35px 0px",
    )
  })

  test("Post can be added", async ({ page }) => {
    await addPost(page, postContent)
    await expect(page.getByTestId("postExcerptContent")).toBeVisible()
  })

  test("Two posts can be added and navigated", async ({ page }) => {
    await addPost(page, postContent)
    await addPost(page, secondPostContent)

    await page.getByText(secondPostContent).locator("..").click()

    await expect(page.getByTestId("content")).toHaveText(secondPostContent)
  })

  describe("Post management", () => {
    let post: Locator
    beforeEach(async ({ page }) => {
      await addPost(page, postContent)
      await page.getByTestId("postExcerpt").click()
      post = page.getByTestId("postContainer")
    })

    test("Post can be rated", async () => {
      await entryCanBeRated(post)
    })

    test("Post can be deleted", async ({ page }) => {
      await entryCanBeDeleted(page, post)
    })

    test("Post can be edited", async () => {
      await entryCanBeEdited(post, postContentEdited)
    })

    test("Comment can be added", async ({ page }) => {
      await addComment(page, commentContent)
      expect(page.getByTestId("postComment")).toContainText(commentContent)
    })

    describe("comment management", () => {
      let comment: Locator
      beforeEach(async ({ page }) => {
        await addComment(page, commentContent)
        comment = page.getByTestId("postComment")
      })

      test("Comment can be rated", async () => {
        await entryCanBeRated(comment)
      })

      test("Comment can be deleted", async ({ page }) => {
        await entryCanBeDeleted(page, comment)
      })

      test("Comment can be edited", async () => {
        await entryCanBeEdited(comment, commentContentEdited)
      })

      test("Reply to a comment can be added", async ({ page }) => {
        addReply(page, replyContent)
        await expect(page.getByTestId("commentReply")).toContainText(
          replyContent,
        )
      })

      describe("Reply management", () => {
        let reply: Locator
        beforeEach(async ({ page }) => {
          await addReply(page, replyContent)
          reply = page.getByTestId("commentReply")
        })

        test("Reply can be rated", async () => {
          await entryCanBeRated(reply)
        })

        test("Reply can be deleted", async ({ page }) => {
          await entryCanBeDeleted(page, reply)
        })

        test("Reply can be edited", async () => {
          await entryCanBeEdited(reply, replyContentEdited)
        })
      })
    })
  })
})
