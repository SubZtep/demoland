import { test, expect } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("/")
  await page.waitForTimeout(5_000)
  await expect(page.getByText("demo.land")).toBeVisible()
})
