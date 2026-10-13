import { expect, test } from '@playwright/test'
import { UsersPage } from '@/pages/UsersPage'
import { readStoredUsers, resetApplication } from '@/utils'

test.beforeEach(async ({ page }) => {
  await resetApplication(page)
})

test('сохраняет участников и восстанавливает их после перехода на главную страницу', async ({ page }) => {
  const usersPage = new UsersPage(page)
  await usersPage.addParticipant('Илья')
  await usersPage.addParticipant('Лиза')
  await usersPage.saveParticipants()
  await expect(page).toHaveURL(/\/products$/)

  await expect.poll(() => readStoredUsers(page)).toEqual([
    { id: 1, name: 'Илья' },
    { id: 2, name: 'Лиза' },
  ])

  await usersPage.openHome()
  await expect(usersPage.nameInputs.nth(0)).toHaveValue('Илья')
  await expect(usersPage.nameInputs.nth(1)).toHaveValue('Лиза')
})

test('запрещает пустые и повторяющиеся имена без учета регистра', async ({ page }) => {
  const usersPage = new UsersPage(page)
  await usersPage.addParticipant()
  await expect(usersPage.saveButton).toBeDisabled()

  await usersPage.fillParticipantName(0, 'Илья')
  await usersPage.addParticipant()
  await usersPage.fillParticipantName(1, 'Илья')
  await expect(usersPage.saveButton).toBeDisabled()
})

test('удаляет участника из списка перед тем как продолжить', async ({ page }) => {
  const usersPage = new UsersPage(page)
  await usersPage.addParticipant('Илья')
  await usersPage.addParticipant('Лиза')
  await usersPage.removeParticipantAt(0)

  await expect(usersPage.nameInputs).toHaveCount(1)
  await expect(usersPage.nameInputs.first()).toHaveValue('Лиза')
  await expect(usersPage.saveButton).toBeEnabled()
})
