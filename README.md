# E2E-тесты приложения «Делим счёт»

Набор UI-автотестов для учебного pet-проекта — приложения для разделения счёта в кафе. Проект показывает подход к проверке пользовательских сценариев.

### **Проверяемое приложение:**

#### GitHub Pages: https://merz1ota.github.io/split_bill_cafe/

#### Исходный код https://github.com/Merz1ota/split_bill_cafe

## Что проверяется

Всего 9 сценариев, сгруппированных по зонам ответственности:

- **Users** - добавлениe, удаление, сохранение, восстановление после перехода, валидация пустых и повторяющихся имён.
- **Products** - обязательные поля, уникальность названий, сумма, плательщик и участники позиции, удаление.
- **Results** - распределение долга, отсутствие долга и сброс счёта.

## Тех. Стек

- TypeScript и Playwright Test.
- Проверки end-to-end в Chromium на опубликованной ([GitHub Pages](https://merz1ota.github.io/split_bill_cafe/)) версии приложения.
- Общие типизированные действия вынесены в `utils/`.
- GitHub Actions запускает проверку типов и тесты на события `push` и `pull_request`.

## Локальный запуск

Требуется Node.js версии 24 и выше

Установка:

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

HTML-отчёт после запуска тестов:

```bash
npx playwright show-report
```

## Структура проекта

```text
.github/workflows/playwright.yml   # Настройки CI в GitHub Actions
tests/
  users/                           # тесты на сценарии users
  products/                        # тесты на сценарии products
  results/                         # тесты на сценарии results
utils/index.ts                     # типизированные переиспользуемые хелперы
```
