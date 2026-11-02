import { test, expect, type Page } from '@playwright/test'


test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Pet Types' }).click()
  await expect(page.getByRole('heading')).toHaveText('Pet Types')
})





test('Update pet type', async ({ page }) => {

  const catInputId = await page.getByRole('row', { name: 'cat' }).getByRole('textbox').getAttribute('id')
  await page.getByRole('row').filter({ has: page.locator(`[id="${catInputId}"]`) }).getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
  await expect(page.getByRole('textbox')).toHaveValue('cat')
  await page.getByRole('textbox').fill('rabbit')
  await page.getByRole('button', { name: 'Update' }).click()
  await expect(page.locator(`[id="${catInputId}"]`)).toHaveValue('rabbit')
  await page.getByRole('row').filter({ has: page.locator(`[id="${catInputId}"]`) }).getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByRole('textbox')).toHaveValue('rabbit')
  await page.getByRole('textbox').fill('cat')
  await page.getByRole('button', { name: 'Update' }).click()
  await expect(page.locator(`[id="${catInputId}"]`)).toHaveValue('cat')

});


test('Cancel pet type update', async ({ page }) => {

  const dogInputId = await page.getByRole('row', { name: 'dog' }).getByRole('textbox').getAttribute('id')
  await page.getByRole('row').filter({ has: page.locator(`[id="${dogInputId}"]`) }).getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByRole('textbox')).toHaveValue('dog')
  await page.getByRole('textbox').fill('moose')
  await expect(page.getByRole('textbox')).toHaveValue('moose')
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.locator(`[id="${dogInputId}"]`)).toHaveValue('dog')

});


test('Validation of Pet type name is required', async ({ page }) => {

  await page.getByRole('row', { name: 'lizard' }).getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByRole('textbox')).toHaveValue('lizard')
  await page.getByRole('textbox').clear()
  await expect(page.locator('span.help-block')).toHaveText('Name is required')
  await page.getByRole('button', { name: 'Update' }).click()
  await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('heading')).toHaveText('Pet Types')

});