# Self-assessment: [anastan588](https://github.com/anastan588)

**Ссылка на Pull Request:** [PR](https://github.com/chebupell/SkillsZen/pull/69)

## 1. Таблица фич (на основе SCORE_PERSONAL.md)

Я провела анализ своего вклада в проект SkillsZen согласно установленной сетке баллов.

| Категория | Фича | Обоснование | Баллы | Ссылка на код |
| :--- | :--- | :--- | :---: | :--- |
| **My Components** | **Complex Component** (JS Code Runner) | Страница задач с редактором кода и логикой проверки через тесты. | 25 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/coding) |
| | **Complex Component** (AI Chat UI) | Интерфейс чата с поддержкой истории и стриминга (GROQ LLM). | 25 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/AIPage) |
| | **Rich UI Screen** (User Profile) | Страница профиля user с формами редактирования и синхронизацией с Firebase. | 20 | [Link](https://github.com/chebupell/SkillsZen/tree/development/SkillsZen/src/pages/profilePage) |
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
| | **Design Patterns** | Применение паттернов Provider, Service Layer и декомпозиция компонентов. | 10 | [AuthContext](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/services/AuthContext.tsx) / [Services](https://github.com/chebupell/SkillsZen/tree/ai-chat/SkillsZen/src/services) / [Decomposition](https://github.com/chebupell/SkillsZen/tree/ai-chat/SkillsZen/src/pages) |
| | **API Layer** | Выделение логики работы с Firebase, GROQ LLM в сервисный слой. | 10 | [Firebase](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/services/firebase.ts) / [GROQ LLM](https://github.com/chebupell/SkillsZen/blob/ai-chat/SkillsZen/src/services/groq.ts) / |
| **Frameworks** | **React** | Использование библиотеки React как основы фронтенда. | 5 | [Link](https://github.com/chebupell/SkillsZen/blob/development/SkillsZen/package.json) |
| **ИТОГО** | | | **245** | |

---

## 2. Описание моей работы

В рамках разработки **SkillsZen** я взяла на себя создание таких модулей приложения как: системы регистрации (аутентификации) пользователя (Auth/Login), персонального пространства пользователя (Profile page), а также интерактивных обучающих инструментов (JS Coding tasks, AI Chat).

Основной стек технологий: React, Tailwind CSS, Shadcn UI, React Hook Form + Zod (валидация), Firebase (Auth & Firestore Cloud), GROQ LLM, Monaco Editor, React Markdown, Vitest (тестирование), Husky, ESLint, Prettier.

**Сложности и решения:**
*   **JS Coding Tasks:** Основной вызов заключался в интеграции **Monaco Editor** и создании системы проверки кода. Задания и соответствующие им наборы тестов динамически подгружаются из **Firestore Cloud**, после чего исполняются на стороне клиента. Для корректного отображения условий задач я внедрила **React Markdown**.
*   **Безопасность AI-чата:** При интеграции GROQ LLM возник вопрос безопасного хранения API-ключа. Было реализовано решение, при котором ключ хранится в защищенном хранилище Firebase и запрашивается непосредственно перед обращением к серверу LLM.
*   **Отказоустойчивость:** Для обработки непредвиденных ситуаций я кастомный компонент **ErrorFallback**, а также информативную страницу **404 (Not Found)** для обработки некорректных путей.

**Краткие итоги процесса:**
*   **Архитектура и планирование:** Участвовала в верхнеуровневой декомпозиции проекта на независимые модули и управляла жизненным циклом задач через **GitHub Dashboard/Issues**.
*   **Проектирование State Management:** Спроектировала и внедрила глобальное управление состоянием через **React Context API**, обеспечив единый источник истины для данных пользователя и настроек приложения без лишнего prop-drilling.
*   **Backend & Data Orchestration:** Реализовала комплексную интеграцию с **Firebase (Auth & Firestore Cloud)**. Настроила архитектуру базы данных для хранения прогресса обучения, истории AI-диалогов и личных данных пользователей с разграничением прав доступа.
*   **Интерактивная среда обучения:** Интегрировала **Monaco Editor** и **React Markdown**, создав полноценную среду для кодинга. Реализовала механизм клиентской валидации кода, позволяющий пользователям мгновенно проверять решения через систему тестов.
*   **Интеграция AI и UX-оптимизация:** Внедрена модель **GROQ LLM** с реализацией **Streaming API**. Это позволило добиться высокой скорости отклика и естественного «посимвольного» отображения ответов, значительно улучшив пользовательский опыт.
*   **Отказоустойчивость (Reliability):** Разработала систему обработки исключений, включая кастомную страницу **404** и глобальный **Error Fallback** (Error Boundary), что исключает «падение» всего интерфейса при ошибках в отдельных модулях.
*   **Гарантия качества (QA):** Организовала процесс модульного тестирования с использованием **Vitest**. Покрытие тестами критической бизнес-логики составило **86%**, что гарантирует стабильность приложения при масштабировании.

---

## 3. Личные Feature Components (Акцент для презентации)

Ниже описаны два модуля, разработанные мной полностью самостоятельно, которые я готова детально продемонстрировать и обосновать на защите:

### 1. Система аутентификации и управления доступом (Auth/Login)
Данный модуль является фундаментом безопасности приложения, обеспечивающим строгий контроль доступа к контенту.
*   **Архитектурное решение**: Внедрен паттерн **Provider** через `AuthContext`, что позволило инкапсулировать логику авторизации и предоставить реактивное состояние пользователя всем компонентам приложения.
*   **Технологический стек**: Интеграция **Firebase Auth** реализована в связке с **React Hook Form** и **Zod**. Это обеспечило строгую типизацию входных данных и сложную клиентскую валидацию еще до отправки запроса на сервер.
*   **Безопасность и UX**: Реализован механизм **Protected Routes**, блокирующий несанкционированный доступ. Система обработки ошибок сервера трансформирует технические ответы Firebase в человекочитаемые уведомления через компоненты **shadcn/ui**, значительно улучшая пользовательский опыт.

### 2. Модуль управления профилем и персональными данными (Profile User Data Page)
Компонент, демонстрирующий навыки проектирования CRUD-операций и синхронизации данных в реальном времени.
*   **Data Orchestration**: Реализован полный цикл взаимодействия с **Firebase Firestore Cloud**. Логика построена на связке уникального идентификатора пользователя (UID) из Auth-сервиса с его документом в базе данных, что гарантирует абсолютную приватность и целостность информации.
*   **Оптимистичный UI и реактивность**: Форма профиля поддерживает переключение между режимами просмотра и редактирования. При сохранении данных реализовано мгновенное обновление локального состояния, что делает интерфейс отзывчивым даже при задержках сети.
*   **Масштабируемость**: Структура данных в Firestore Cloud спроектирована с учетом расширения (добавление полей), что подтверждает продуманность архитектуры на уровне БД.




