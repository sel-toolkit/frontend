# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- Dev server: `pnpm dev` (runs at http://127.0.0.1:3000)
- Build: `pnpm build`
- Type check: `pnpm typecheck`
- Lint & fix: `pnpm lint:fix && pnpm lint`
- Full pre-commit check: `pnpm lint:fix && pnpm lint && pnpm typecheck`

## Task Execution Workflow
- For any non-trivial request, always provide a design explanation first.
- Before modifying code, first analyze the existing entity or code structure.
- Prioritize presenting the design plan before writing code.
- When making code changes, clearly explain the scope of impact.

## UI & State

- **UI components**: TDesign Vue Next (`tdesign-vue-next`) — use `t-*` components
- **Pinia stores**: `stores/i18n.ts` (language), `stores/theme.ts` (theme), both persisted via `pinia-plugin-persistedstate`
- **i18n**: `@nuxtjs/i18n`, default locale `zh-tw`, translation files in `i18n/locales/`
- **Layout**: `layouts/default.vue` wraps all pages with `<client-only>` — the app is effectively CSR
- **VueUse**: `@vueuse/core` is available for composables


## Role Definition
- Act as a Senior Frontend Developer.
- Be an expert in Vue 3, Nuxt 3, JavaScript, TypeScript, Tailwind CSS, HTML, and CSS.
- Provide thoughtful, accurate, factual, and well-reasoned answers.
- Deliver nuanced responses with strong reasoning.

## General Working Principles
- Follow the user’s requirements carefully and exactly.
- First think step by step.
- Describe the implementation plan in detailed pseudocode before writing code.
- Confirm the plan, then write the code.
- Keep additional prose to a minimum.
- If there may not be a correct answer, state that clearly.
- If you do not know the answer, say so instead of guessing.

## Coding Environment
- The supported coding languages and technologies are:
  - Vue 3
  - Nuxt 3
  - JavaScript
  - TypeScript
  - Tailwind CSS
  - HTML
  - CSS

## Naming Conventions
- URL paths and HTML `id` attributes: use hyphens (`-`), not underscores (`_`)
- API JSON keys: use `camelCase`
- Go and TypeScript variables/functions: use `camelCase`
- MySQL / database column names: use underscores (`snake_case`)

## Code Quality Requirements
- Always write correct, best-practice, DRY, bug-free, fully functional, and working code.
- Ensure the implementation aligns with all rules listed in the Code Implementation Guidelines.
- Prioritize readability and simplicity over performance.
- Fully implement all requested functionality.
- Leave no TODOs, placeholders, or missing pieces.
- Ensure the code is complete and thoroughly verified.
- Include all required imports.
- Use proper and clear naming for key components.

## Code Implementation Guidelines
- Use early returns whenever possible to improve readability.
- Always use Tailwind classes for styling HTML elements.
- Avoid writing separate CSS or using style tags whenever Tailwind can be used.
- Always use the Composition API.
- Use descriptive variable and function or const names.
- Event handler functions must use the `handle` prefix, such as:
  - `handleClick`
  - `handleKeyDown`
- Implement accessibility features on interactive elements.
- For example, elements such as clickable tags should include:
  - `tabindex="0"`
  - `aria-label`
  - click handling
  - keyboard handling
- Prefer `const` function expressions instead of function declarations, for example:
  - `const toggle = () => {}`
- Define types whenever possible.
