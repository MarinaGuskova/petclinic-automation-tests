import { test, expect, type Page } from '@playwright/test'

// Finds a pet type row by its name instead of relying on its position in the table

async function findPetTypeRow(page: Page, name: string) {
  const rows = page.locator('#pettypes tbody tr')

  await expect(rows.first()).toBeVisible()

  const indexes = await rows.evaluateAll((elements, targetName) =>
    elements.flatMap((row, index) =>
      row.querySelector<HTMLInputElement>('input[name="pettype_name"]')?.value === targetName
        ? [index]
        : []
    ),
    name
  );

  expect(indexes, `Expected exactly one pet type named "${name}"`).toHaveLength(1)
  return rows.nth(indexes[0])
}

// Reuses the steps for focusing and filling in the pet type name field across multiple tests
async function fillPetTypeName(page: Page, name: string) {
  const nameInput = page.locator('#name')
  await nameInput.click()
  await nameInput.fill(name)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Pet Types' }).click()
  await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()
})


test('Update pet type', async ({ page }) => {

  const catRow = await findPetTypeRow(page, 'cat');
  await catRow.getByRole('button', { name: 'Edit' }).click()

  await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()
  await fillPetTypeName(page, 'rabbit')
  await page.getByRole('button', { name: 'Update' }).click()

  const rabbitRow = await findPetTypeRow(page, 'rabbit')
  await expect(rabbitRow.locator('input[name="pettype_name"]')).toHaveValue('rabbit')
  await rabbitRow.getByRole('button', { name: 'Edit' }).click()

  await fillPetTypeName(page, 'cat')
  await page.getByRole('button', { name: 'Update' }).click()

  const restoredCatRow = await findPetTypeRow(page, 'cat')
  await expect(restoredCatRow.locator('input[name="pettype_name"]')).toHaveValue('cat')

});


test('Cancel pet type update', async ({ page }) => {

  const dogRow = await findPetTypeRow(page, 'dog')
  await dogRow.getByRole('button', { name: 'Edit' }).click()
  await fillPetTypeName(page, 'moose')
  await expect(page.locator('#name')).toHaveValue('moose')
  await page.getByRole('button', { name: 'Cancel' }).click()
  const dogRowAfterCancel = await findPetTypeRow(page, 'dog')
  await expect(dogRowAfterCancel.locator('input[name="pettype_name"]')).toHaveValue('dog')
});


test('Validation of Pet type name is required', async ({ page }) => {

  const lizardRow = await findPetTypeRow(page, 'lizard')
  await lizardRow.getByRole('button', { name: 'Edit' }).click()
  await page.locator('#name').click();
  await page.locator('#name').clear()
  await expect(page.getByText('Name is required')).toBeVisible()
  await page.getByRole('button', { name: 'Update' }).click()
  await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible()

});