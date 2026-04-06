# Self assessment PR: [link](https://github.com/chebupell/SkillsZen/pull/66)

1. ## Список фич (Итого: 120 баллов)

### My components (75 баллов)

Ссылки ниже даны на код в ветке `development`.

- **Complex Component** – Course Page (+25): страницы курсов `JS`, `TS` и `Algorithms` со списками тем, прогрессом по блокам и статус-тэгами.

Код:<br>
[coursePage.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/coursePage/coursePage.tsx), <br>
[courseSubPage.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/courseSubPage/courseSubPage.tsx),<br>
[startTag.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tags/startTag.tsx),<br>
[inProgressTag.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tags/inProgressTag.tsx),<br>
[successTag.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tags/successTag.tsx),<br>
[retryTag.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tags/retryTag.tsx)

- **Complex Component** – Practice Page (+25): страница практики с загрузкой вопросов, прогрессом, выбором ответа и переходом к следующему вопросу.

Код:<br>
[practicePage.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/practice/practicePage.tsx),<br>
[practiceSubPage.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/practice/practiceSubPage.tsx),<br>
[ProgressBar.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/components/shared/ProgressBar.tsx),<br>
[nextQuestionButton.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/components/shared/nextQuestionButton.tsx),<br>
[seeResultsButton.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/components/shared/seeResultsButton.tsx),<br>
[practiceService.ts](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/practiceService.ts)<br>

- **Complex Component** – TS Cards Page (+25): страница карточек по типам TypeScript с переворотом карт, отметкой изученных и сохранением прогресса.

Код:<br>
[tsCardsPage.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tsCardsPage/tsCardsPage.tsx),<br>
[garden.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tsCardsPage/garden.tsx),<br>
[gardenProgress.tsx](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tsCardsPage/gardenProgress.tsx),<br>
[tsCardsProgressService.ts](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/tsCardsProgressService.ts)<br>

### Backend & Data (15 баллов)

- **BaaS CRUD** – работа с Firestore через сервисы для получения / создания / обновления данных.

Код:<br>
[practiceService.ts](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/practiceService.ts),<br>
[tsCardsProgressService.ts](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/tsCardsProgressService.ts)<br>

### UI & Interaction (15 баллов)

- **Responsive** (+5) – адаптивная верстка для экранов от 320px на всех страницах.<br>

- **Advanced Animations** (+10) – на странице TS Cards реализован 3D-переворот карточек и анимация летающих значков.<br>

### Architecture (10 баллов)

- **API Layer** – логика работы с Firestore вынесена в `services/*`, компоненты остаются без прямых запросов к БД.

Код:<br>
[practiceService.ts](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/practiceService.ts),<br>
[tsCardsProgressService.ts](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/tsCardsProgressService.ts)<br>

### Frameworks (5 баллов)

- **React** – приложение написано на React.


2. ## Описание работы
На этом проекте я впервые работала с React — на нем построено все приложение. Также использовала Tailwind CSS для стилизации и написала первые тесты с помощью Vitest.<br>

Для хранения данных и авторизации нашей командой был выбран Firebase Firestore — в нем реализовано хранение прогресса пользователя и состояния приложения. Изначально я запускала backend через Docker и пробовала деплой на render.com, однако в итоге было принято решение перейти на Firebase из-за задержек при работе с render.com.<br>

На старте проекта я продумала дизайн и спроектировала структуру приложения: выделила переиспользуемые компоненты в shared (например, PageLayout, BackButton), настроила базовый роутинг и реализовала адаптивную верстку.<br>

Основная работа была связана с реализацией интерфейса и логики ключевых страниц:
- Course Page — отображение тем, прогресса по блокам и статус-тегов
- Practice Page — загрузка вопросов, обработка ответов пользователя и переход между заданиями
- TS Cards Page — карточки для самопроверки с переворотом, отметкой изученных элементов и расчетом прогресса

Также я реализовала несколько пользовательских UI-решений:
- статус-теги с разными состояниями (not started / in progress / completed / try again)
- 3D-переворот карточек
- анимацию добавления элементов в “сад”

Основные сложности возникли при работе с асинхронной логикой и Firebase (CRUD-операции и сохранение прогресса пользователя), а также при настройке деплоя и интеграции backend-части.


3. ## Два личных Feature Component (для защиты)

Смотреть код в ветке `development`.

1) Страница выбранного курса (TS, JS, алгоритмы) - [CoursePage](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/coursePage/coursePage.tsx)
2) Страница с карточками для самопроверки по TS - [TsCardsPage](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/exercises/tsCardsPage/tsCardsPage.tsx)
