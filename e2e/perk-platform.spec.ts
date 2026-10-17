import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123'

test.describe('Perk Application Platform journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('email-input').fill(TEST_EMAIL)
    await page.getByTestId('password-input').fill(TEST_PASSWORD)
    await page.getByTestId('login-button').click()
    await page.waitForURL('**/home')
  })

  test('should show offer list with seeded offers after login', async ({ page }) => {
    await expect(page.getByTestId('offer-list')).toBeVisible()
    await expect(page.getByTestId('offer-item').first()).toBeVisible()
  })

  test('should open create offer form when create-offer-button is clicked', async ({ page }) => {
    await page.getByTestId('create-offer-button').click()
    await expect(page.getByTestId('offer-form')).toBeVisible()
  })

  test('should create a new offer and display it in the offer list', async ({ page }) => {
    await page.getByTestId('create-offer-button').click()
    await expect(page.getByTestId('offer-form')).toBeVisible()

    await page.getByTestId('offer-merchant-input').fill('MERCHANT_TEST')
    await page.getByTestId('offer-sku-input').fill('SKU_Z')
    await page.getByTestId('offer-discount-input').fill('15')
    await page.getByTestId('offer-start-date-input').fill('2026-01-01')
    await page.getByTestId('offer-end-date-input').fill('2026-12-31')
    await page.getByTestId('offer-status-select').selectOption('ACTIVE')

    await page.getByTestId('offer-submit-button').click()

    await expect(page.getByTestId('offer-form')).not.toBeVisible()
    const newOfferRow = page.getByTestId('offer-item').filter({ hasText: 'MERCHANT_TEST' })
    await expect(newOfferRow).toBeVisible()
  })

  test('should toggle offer status badge from ACTIVE to INACTIVE', async ({ page }) => {
    await page.getByTestId('create-offer-button').click()
    await expect(page.getByTestId('offer-form')).toBeVisible()

    await page.getByTestId('offer-merchant-input').fill('MERCHANT_TEST')
    await page.getByTestId('offer-sku-input').fill('SKU_Z')
    await page.getByTestId('offer-discount-input').fill('15')
    await page.getByTestId('offer-start-date-input').fill('2026-01-01')
    await page.getByTestId('offer-end-date-input').fill('2026-12-31')
    await page.getByTestId('offer-status-select').selectOption('ACTIVE')

    await page.getByTestId('offer-submit-button').click()
    await expect(page.getByTestId('offer-form')).not.toBeVisible()

    const newOfferRow = page.getByTestId('offer-item').filter({ hasText: 'MERCHANT_TEST' }).first()
    await expect(newOfferRow).toBeVisible()

    const statusBadge = newOfferRow.getByTestId('offer-status-badge')
    await expect(statusBadge).toContainText('ACTIVE')

    const toggleButton = newOfferRow.getByTestId('toggle-status-button')
    await toggleButton.click()

    await expect(statusBadge).toContainText('INACTIVE')
  })
})

test.describe('Redemption Export journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('email-input').fill(TEST_EMAIL)
    await page.getByTestId('password-input').fill(TEST_PASSWORD)
    await page.getByTestId('login-button').click()
    await page.waitForURL('**/home')
  })

  test('should navigate to Redemptions page and show seeded redemptions', async ({ page }) => {
    await page.getByTestId('nav-redemptions').click()
    await page.waitForURL('**/redemptions')

    await expect(page.getByTestId('redemption-list')).toBeVisible()
    await expect(page.getByTestId('redemption-item').first()).toBeVisible()
  })

  test('should trigger a CSV file download when export-csv-button is clicked', async ({ page }) => {
    await page.getByTestId('nav-redemptions').click()
    await page.waitForURL('**/redemptions')

    await expect(page.getByTestId('redemption-list')).toBeVisible()

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('export-csv-button').click(),
    ])

    expect(download.suggestedFilename()).toContain('redemptions')
  })
})
