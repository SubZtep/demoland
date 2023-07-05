import { expect, test } from "vitest"
import { createRandomColour } from "../../web/src/lib/misc"

test("createRandomColour", () => {
  expect(createRandomColour()).toMatch(/^#[0-9a-f]{6}$/i)
})
