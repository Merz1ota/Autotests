import { expect, test } from '@playwright/test'
import { ResultsPage } from '@/pages/ResultsPage'
import { addParticipants, addProduct, openResults, resetApplication } from '@/utils'

test.beforeEach(async ({ page }) => {
  await resetApplication(page)
  await addParticipants(page)
})

test('делит общую позицию между участниками и сбрасывает счет', async ({ page }) => {
  const resultsPage = new ResultsPage(page)
  await addProduct(page, {
    name: 'Пицца',
    price: 900,
    payer: 'Илья',
    eaters: ['Илья', 'Лиза'],
  })
  await openResults(page)

  const debtRow = resultsPage.debtRowFor('Лиза')
  await expect(debtRow).toContainText('Илья')
  await expect(debtRow).toContainText('450')

  await resultsPage.reset()
  await expect(page).toHaveURL(/\/split_bill_cafe\/$/)
  await expect(page.getByText('Список пуст...')).toBeVisible()
})

test('не создает долг, если позицию оплатил единственный участник, который ее ел', async ({ page }) => {
  const resultsPage = new ResultsPage(page)
  await addProduct(page, {
    name: 'Кофе',
    price: 250,
    payer: 'Илья',
    eaters: ['Илья'],
  })
  await openResults(page)
  await expect(resultsPage.cells).toHaveCount(0)
})

test('взаимно засчитывает долги участников', async ({ page }) => {
  const resultsPage = new ResultsPage(page)
  await addProduct(page, {
    name: 'Пицца',
    price: 100,
    payer: 'Илья',
    eaters: ['Илья', 'Лиза'],
  })
  await addProduct(page, {
    name: 'Десерт',
    price: 40,
    payer: 'Лиза',
    eaters: ['Илья', 'Лиза'],
  })
  await openResults(page)

  const netDebtRow = resultsPage.debtRowFor('Лиза').filter({ hasText: '30' })
  await expect(netDebtRow).toContainText('Илья')
  await expect(netDebtRow).toContainText('30')
  const cancelledDebtRow = resultsPage
    .debtRowFor('Илья')
    .filter({ hasText: 'Лиза' })
    .filter({ has: page.getByRole('cell', { name: '0', exact: true }) })
  await expect(cancelledDebtRow).toHaveCount(1)
})
