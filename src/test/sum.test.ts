import { describe, expect, test } from "@jest/globals"
import { errorThrow, sum } from "./funcs"

describe("funcs module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3)
  })

  test("using not modifier", () => {
    expect(errorThrow).toThrow("error")
  })
})
