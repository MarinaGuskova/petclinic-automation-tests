import { test, expect, type Page } from '@playwright/test'

async function openEditVet(page: Page, vetName: string) {
    await page.getByRole('row', { name: vetName }).getByRole('button', { name: 'Edit Vet' }).click()
}

async function checkAll(page: Page) {
    const checkboxes = page.getByRole('checkbox')
    await expect(checkboxes.first()).toBeVisible()

    for (const checkbox of await checkboxes.all()) {
        await checkbox.check()
        await expect(checkbox).toBeChecked()
    }
}

async function uncheckAll(page: Page) {
    const checkboxes = page.getByRole('checkbox')
    await expect(checkboxes.first()).toBeVisible()

    for (const checkbox of await checkboxes.all()) {
        await checkbox.uncheck()
        await expect(checkbox).not.toBeChecked()
    }
}


test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
})


test('Validate selected specialties', async ({ page }) => {

    await expect(page.getByRole('heading')).toHaveText('Veterinarians')
    await openEditVet(page, 'Helen Leary')
    await expect(page.locator('.selected-specialties')).toHaveText('radiology')
    await page.locator('.selected-specialties').click()
    await expect(page.getByRole('checkbox', { name: 'radiology' })).toBeChecked()
    await expect(page.getByRole('checkbox', { name: 'surgery' })).not.toBeChecked()
    await expect(page.getByRole('checkbox', { name: 'dentistry' })).not.toBeChecked()
    await page.getByRole('checkbox', { name: 'surgery' }).check()
    await page.getByRole('checkbox', { name: 'radiology' }).uncheck()
    await expect(page.locator('.selected-specialties')).toHaveText('surgery')
    await page.getByRole('checkbox', { name: 'dentistry' }).check()
    await expect(page.locator('.selected-specialties')).toHaveText('surgery, dentistry')
});



test('Select all specialties', async ({ page }) => {

    await openEditVet(page, 'Rafael Ortega')
    await expect(page.locator('.selected-specialties')).toHaveText('surgery')
    await page.locator('.selected-specialties').click()
    await checkAll(page)
    await expect(page.locator('.selected-specialties')).toHaveText('surgery, radiology, dentistry')

});


test('Unselect all specialties', async ({ page }) => {

    await openEditVet(page, 'Linda Douglas')
    await expect(page.locator('.selected-specialties')).toHaveText('dentistry, surgery')
    await page.locator('.selected-specialties').click()
    await uncheckAll(page)
    await expect(page.locator('.selected-specialties')).toHaveText('')

});