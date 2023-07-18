import { expect, test } from "vitest"
import * as lib from "../../web/src/lib/misc"

test("createRandomColour", () => {
  expect(lib.createRandomColour()).toMatch(/^#[0-9a-f]{6}$/i)
})
