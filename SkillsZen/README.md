# SkillsZen

SkillsZen is an interactive learning platform for studying TypeScript, JavaScript, and algorithms, combining theory, practice, and progress tracking in one application. It provides a clear learning journey: from choosing a course and exploring topics to completing practice tasks, solving coding challenges, and using the AI chat for additional support.

The platform stores personalized course progress and helps users track their learning at every stage. The **TS Cards** format makes revision more engaging and visual: users can mark completed topics and follow their progress through a garden-based mechanic. The **Coding Tasks** section allows learners to apply knowledge immediately with a built-in editor, test execution, and draft saving. The **AI chat** complements this experience as an integrated assistant that also stores conversation history inside the platform.

## Local Setup

To run the project locally, make sure you have Node.js 20+ and npm installed.

Clone the repository and go to the application folder:

```bash
git clone git@github.com:chebupell/SkillsZen.git
cd SkillsZen/SkillsZen
```

Install dependencies:

```bash
npm install
```

This command installs all packages required for local development, production build, linting, formatting, and testing.

Create a local environment file from the example:

```bash
cp .env.example .env
```

The .env file stores Firebase configuration values that are required for the application to connect to backend services.

Run the app locally:

```bash
npm run dev
```

This command starts the Vite development server with hot reload, so changes in the source code appear in the browser without a full manual restart.

The app will usually be available at `http://localhost:5173`.

## Environment Variables

The project uses Firebase environment variables. Use `.env.example` as a template:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGE_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## Useful Commands

### `npm run dev`

Starts the application in development mode using Vite. This is the main command for day-to-day work on the project because it provides fast rebuilds and hot module replacement.

### `npm run build`

Builds the application for production. The command first runs TypeScript compilation and then creates an optimized production bundle with Vite.

### `npm run preview`

Runs a local preview server for the production build. This is useful when you want to verify how the built application behaves before deployment.

### `npm run lint`

Checks the project with ESLint. It helps find code style issues, incorrect patterns, and potential problems before pushing changes.

### `npm run format`

Formats files with Prettier. This command helps keep code style consistent across the entire project.

### `npm run test`

Runs the test suite with Vitest. It is useful for checking whether recent changes broke existing functionality.

### `npm run test:watch`

Runs Vitest in watch mode. Tests automatically restart when related files change, which is convenient during active development.

### `npm run test:ui`

Opens the Vitest user interface, where you can browse, run, and inspect tests in a more visual way.

### `npm run test:coverage`

Runs the tests and generates a coverage report. This is helpful when you want to see how much of the codebase is covered by automated tests.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase
- Vitest
- ESLint
- Prettier
