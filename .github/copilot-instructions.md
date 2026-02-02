# Copilot Instructions

## Language and Communication Policy

- Always think, reason, and write code in English
- Always respond to user instructions and questions in **Japanese**
- Use concise, telegraphic style - minimize volume
- Avoid unnecessary explanations and emojis

## Documentation

- `docs/requirement-*.md` for requirements, specifications, and constraints
- `docs/task-*.md` for task breakdowns and progress

## Reference Skills

- Skills are useful for specific contexts.
- `.github/skills/*/SKILL.md` files define each skill.

| Skill                 | When Used                                                           |
| --------------------- | ------------------------------------------------------------------- |
| `coding-standards`    | Code implementation, refactoring, testing                           |
| `context7-mcp`        | Access up-to-date, version-specific official documentation and code |
| `honox-architecture`  | HonoX development, routing, Islands, component patterns             |
| `nextjs-architecture` | Next.js App Router projects                                         |
| `planning`            | Planning phase, requirement gathering, task breakdown               |
| `playwright-mcp`      | Browser automation, web interaction, Playwright MCP                 |
| `ui-design`           | UI/UX design, styling, accessibility                                |

## Task Execution Workflow

**For every request**: Silently evaluate which skill(s) would help most. Load matching SKILL.md file(s) into context if relevant.

1. List tasks, files and what you do → **Get approval**
2. Execute implementation
3. Run tests → If fails, investigate and propose fixes → **Get approval** → Fix
4. Prepare commit message → **Get approval** → Commit

## Trigger Keywords

When user input contains these keywords → **STOP & REQUEST APPROVAL**

- commit, push, git add
- create, modify, delete, fix, refactor
- test, build, deploy

## Tools

Use **pnpm** for all package management

## Git Workflow

### Commit Format

`<type>: <description>`

**Types:** add, fix, remove, update, WIP

### Rules

- English, imperative mood (Add, Update, Fix)
- Lowercase description, no period
- Be specific and concise
