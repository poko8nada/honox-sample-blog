---
name: playwright-mcp
description: Use Playwright MCP server for browser automation. Enables AI agents to interact with web pages via structured accessibility snapshots, without screenshots. Ideal for testing, scraping, or automated workflows.
---

# Playwright MCP Skill

## Overview

This skill integrates the Playwright MCP server (from microsoft/playwright-mcp) to allow AI agents to control real browsers (Chromium, Firefox, WebKit) through MCP protocol. It provides actions like navigating pages, clicking elements, filling forms, evaluating JavaScript, and more. Use this for agentic loops where persistent browser state and iterative reasoning are needed.

Key benefits:

- Token-efficient compared to full DOM snapshots.
- Supports persistent sessions for long-running tasks.
- Bypasses visual models by using accessibility trees.

**Note:** This is different from Playwright CLI. If you're using a coding agent for simple commands, consider Playwright CLI instead. For specialized, stateful automation, MCP is better.

## When to Use

- When the task involves browser interaction: e.g., web testing, form submission, data extraction.
- For exploratory automation, self-healing tests, or workflows requiring real-time page introspection.
- Avoid for simple CLI-based tasks; use Playwright CLI skill instead.
- Trigger when user mentions "browser automation", "web interaction", "Playwright MCP", or similar.

## Core Capabilities

- Start MCP server: `npx @playwright/mcp@latest`
- MCP Tools available (call via MCP protocol):
  - `open_page`: Open a new page with URL.
  - `click`: Click on an element by selector.
  - `type`: Type text into an input field.
  - `wait_for`: Wait for element, navigation, or timeout.
  - `evaluate`: Run JavaScript on the page.
  - `screenshot`: Take a screenshot (optional, for verification).
  - `get_accessibility_tree`: Retrieve structured page snapshot.
  - `close`: Close the browser or page.
- Maintain session state across multiple actions.
- Handle errors with retries or self-healing logic.

## Example: Form Submission

1. Start MCP server: `npx @playwright/mcp@latest`.
2. Open page: Call `open_page` with URL "https://example.com/login".
3. Fill form: `type` on selector "#username" with "user", then "#password" with "pass".
4. Submit: `click` on "button[type=submit]".
5. Verify: `wait_for` selector ".success-message", then get accessibility tree.
6. Close: `close`.

Prompt example: "Use Playwright MCP to log into example.com and submit a form."

## Example: Multi-tab Workflow

- Open main page.
- Click link to open new tab.
- Switch contexts and interact.
- Collect data from both tabs.

## Example: Debugging with Accessibility Tree

- After any action, call `get_accessibility_tree` to inspect page structure.
- Use for reasoning: "Based on the tree, find the login button and click it."

## Best Practices

- Keep actions atomic: One tool call per step for better error handling.
- Use headless mode for efficiency, visible for debugging.
- Handle exceptions: If an action fails, retry with adjusted selectors.
- Token optimization: Request snapshots only when needed.
- Integration: Works with Claude Code via `claude mcp add playwright npx '@playwright/mcp@latest'`.

## Limitations

- Requires Node.js and Playwright installed.
- Not for visual-heavy tasks (use screenshots sparingly).
- For coding agents, CLI might be more efficient; MCP for persistent state.

Footer: Based on microsoft/playwright-mcp. Update with latest version for new features.
