# Drone-Webapp

Based on: https://github.com/theodorusclarence/ts-nextjs-tailwind-starter

## Getting Started

### 1. Install dependencies

It is encouraged to use **pnpm**.

```bash
pnpm install
```

### 2. Run the development server

You can start the server using this command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`.

## pnpm Scripts

This project uses `pnpm` for managing various development tasks. Below is a description of the scripts available in the `package.json` file.

### `pnpm dev`

- **Command:** `next dev`
- **Description:** Starts the Next.js application in development mode. It includes hot-reloading, so changes in your code will be automatically reflected in the browser.

### `pnpm build`

- **Command:** `NEXT_OUTPUT_MODE=standalone NODE_OPTIONS=--max_old_space_size=8192 next build`
- **Description:** Builds the Next.js application for production deployment. It creates a standalone version with an increased memory limit (`--max_old_space_size=8192`) to handle larger build processes.

### `pnpm start`

- **Command:** `next start`
- **Description:** Launches the Next.js application in production mode. Use this after building your app with `pnpm build`.

### `pnpm lint`

- **Command:** `next lint`
- **Description:** Runs the Next.js built-in linter to check for code quality issues in your project.

### `pnpm lint:fix`

- **Command:** `eslint src --fix && pnpm format`
- **Description:** Automatically fixes linting issues in your source code (`src` directory) and then formats the code using Prettier.

### `pnpm lint:strict`

- **Command:** `eslint --max-warnings=0 src`
- **Description:** Runs ESLint on the source code with a strict configuration that treats warnings as errors.

### `pnpm typecheck`

- **Command:** `NODE_OPTIONS=--max_old_space_size=8192 tsc --noEmit --incremental false`
- **Description:** Performs a TypeScript type check on your codebase without emitting any output, and with an increased memory limit. Disables incremental compilation for a full type-check.

### `pnpm test:watch`

- **Command:** `jest --watch`
- **Description:** Runs tests in watch mode using Jest. This mode reruns tests related to changed files automatically.

### `pnpm test`

- **Command:** `jest`
- **Description:** Executes all tests once using Jest.

### `pnpm format`

- **Command:** `prettier -w .`
- **Description:** Formats all files in the project according to Prettier configuration.

### `pnpm format:check`

- **Command:** `prettier -c .`
- **Description:** Checks if files in the project are formatted according to Prettier's rules.

### `pnpm postbuild`

- **Command:** `next-sitemap --config next-sitemap.config.js`
- **Description:** Generates a sitemap for the Next.js application using the `next-sitemap` tool with the specified configuration file.

### `pnpm prepare`

- **Command:** `husky install`
- **Description:** Installs Husky, which is used to manage Git hooks in your project. This ensures that certain scripts (like linters, formatters, or tests) are run before commits are made.
