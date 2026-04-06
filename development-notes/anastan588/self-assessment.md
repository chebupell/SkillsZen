# Self-assessment: [anastan588](https://github.com/anastan588)

**Ссылка на Pull Request:** [PR](https://github.com/chebupell/SkillsZen/pull/69)

## 1. Таблица фич (на основе SCORE_PERSONAL.md)

Я провела анализ своего вклада в проект SkillsZen согласно установленной сетке баллов.

| Категория | Фича | Обоснование | Баллы | Ссылка на код / PR |
| :--- | :--- | :--- | :---: | :--- |
| **My Components** | **Complex Component** (JS Code Runner) | Страница задач с редактором кода и логикой проверки через тесты. | 25 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/coding) |
| | **Complex Component** (AI Chat UI) | Интерфейс чата с поддержкой истории и стриминга (GROQ LLM). | 25 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/AIPage) |
| | **Rich UI Screen** (User Profile) | Страница профиля с формами редактирования и синхронизацией с Firebase. | 20 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/profilePage) |
| | **Rich UI Screen** (Auth/Login) | Страница авторизации/аутентификации с валидацией и состояниями. | 20 | [Login](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/login) / [Auth](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/auth)|
| | **Rich UI Screen** (Error Handling) | Реализация страниц 404 (Not Found) и ErrorFallback для обработки исключений. | 20 | [404](https://github.com/chebupell/SkillsZen/tree/ai-chat/SkillsZen/src/pages/404Page) / [Error](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/components/shared/ErrorFallback.tsx) |
| **Backend & Data** | **BaaS Auth** | Полная настройка авторизации через Firebase Auth (Email/Password). | 15 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/firebase.ts) |
| | **BaaS CRUD** | Интеграция Firestore Cloud: хранение профилей, истории чата, прогресса задач и база тасков. | 15 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/services/firebase.ts) |
| **AI** | **AI Chat UI** | Интерфейс взаимодействия с LLM (отправка/отображение промптов). | 20 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/components/shared/AI%20chat) |
| | **AI Streaming** | Реализация посимвольного вывода ответа (real-time typing эффект). | 10 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/components/shared/AI%20chat/TypingIndicator.tsx) |
| **UI & Interaction** | **Code Editor** | Внедрение и глубокая настройка редактора кода Monaco. | 15 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/coding/EditorPage.tsx) |
| | **Responsive** | Полная адаптация верстки под мобильные устройства (от 320px). | 5 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/src/pages/auth/authPage.tsx) |
| **Quality** | **Unit Tests (Basic)** | Покрытие личного кода модульными тестами более 20%. | 10 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/tests) |
| | **Unit Tests (Full)** | Увеличение покрытия до 60% (подтверждено логами и отчетами). | 10 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/tests) |
| **Architecture** | **State Manager** | Использование React Context (AuthContext) для управления состоянием авторизации. | 10 | [Link](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/services/AuthContext.tsx) |
| | **API Layer** | Выделение логики работы с Firebase, GROQ LLM в сервисный слой. | 10 | [Firebase](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/services/firebase.ts) / [GROQ LLM](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/services/groq.ts) / |
| **Frameworks** | **React** | Использование библиотеки React как основы фронтенда. | 5 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/package.json) |
| **ИТОГО** | | | **235** | |

---

## 2. Описание моей работы

В рамках разработки **SkillsZen** я взяла на себя создание фундаментальных модулей приложения: системы регистрации (аутентификации) пользователя (Auth/Login), персонального пространства пользователя (Profile page) и обучающих инструментов JS Coding tasks, AI Chat.

Основной стек технологий: React, Tailwind, Husky, Eslint, Prettier, Shadcn library of components, React Hook Forms, Zod for validation, Firebase, GROQ LLM, Monaco editor, React Markdown, Vitest for testing.

Основная сложность заключалась в разработке страницы с кодовыми заданиями и внедрение редактора кода с тестами.  Кодовые задания сохранены на Firestore Cloud (текст задания, а также тесты к нему).

Tакже при разработке AI чата с помощью GROQ LLM столкнулась с проблемой места хранения API ключа для работы запросов на сервер LLM. Решение - ключ сохранен на Firebase Firestore Cloud и запрашивается перед запросом к LLM.

**Краткие итоги процесса:**
*   **Архитектура:** Участвовала в декомпозиции проекта на логические компоненты и ведении GitHub Dashboard.
*   **Технологии:** Использовала React в связке с Firebase для обеспечения надежного бэкенда и облачного хранения данных.
*   **Реализация работы с пользователем:** Реализовала работу с пользователем через его регистрацию/аутентификацию/обновление с помощью Firebase Auth and Cloud.
*   **Интеграция React Markdown:** Ипользовала React Markdown для отображения текста задач кодовых заданий по JS.
*   **Интеграция Monaco editor:** Внедрила Monaco Editor для создания интерактивной страницы кодовых заданий по JS и реализовала их тестирование пользователем с помощью тестов.
*   **Интеграция AI:** Внедрила GROQ LLM для создания интерактивного помощника, реализовав стриминг данных для лучшего UX.
*   **Качество:** Провела работу над тестированием, закрыв основной код приложения тестами, что позволило достичь 86% покрытия.

---

## 3. Личные Feature Components (Акцент для презентации)

Ниже описаны два компонента, разработанные мной полностью самостоятельно, которые я готова детально продемонстрировать на защите:

### 1. Система аутентификации и контроля доступа (Auth/Login)
Это критически важный узел приложения, обеспечивающий безопасность данных пользователей. 
*   **Реализация**: Интегрирована система Firebase Auth (Email/Password) с кастомной валидацией форм c помощью React Hook Forms, Zod schema validation.
*   **Глобальное состояние**: Создан `AuthContext`, который управляет статусом авторизации во всем приложении, обеспечивая работу защищенных роутов (Protected Routes).
*   **UX/UI**: Реализована обработка специфических ошибок сервера (неверный пароль, отсутствие пользователя) с выводом понятных уведомлений через компоненты shadcn/ui.

### 2. Управление личными данными пользователя (Personal Data Page)
Компонент, демонстрирующий навыки работы с CRUD-операциями и облачными хранилищами данных:
*   **Работа с DB**: Реализована логика сохранения и получения пользовательских данных из Firebase Firestore, Firebase Auth.
*   **Интерактивность**: Форма профиля поддерживает режим редактирования с мгновенным обновлением интерфейса после успешной синхронизации с базой данных.
*   **Синхронизация**: Данные профиля связаны с UID текущего пользователя, что гарантирует приватность и корректность отображения информации при смене аккаунта.



