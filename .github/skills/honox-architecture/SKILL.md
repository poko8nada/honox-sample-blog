---
name: honox-architecture
description: HonoX architecture guidelines including file-based routing, Islands pattern, component types, performance optimization, and best practices for full-stack development.
---

# HonoX Architecture Guidelines

Always consult Context7 and official HonoX documentation if you plan to deviate from these guidelines.

## Version & Stack

- **HonoX**: 0.1.52+
- **Renderer**: hono/jsx
- **Build Tool**: Vite
- **Runtime**: Cloudflare Workers (Wrangler)
- **CSS Framework**: Tailwind CSS v4

## Core Concepts

### File-Based Routing

Routes are automatically generated from the `app/routes/` directory structure:

- `app/routes/index.tsx` → `/`
- `app/routes/posts/[id].tsx` → `/posts/:id` (dynamic)
- `app/routes/_renderer.tsx` → Global layout (NOT a route)
- `app/routes/_404.tsx` → Custom 404 handler
- `app/routes/_error.tsx` → Custom error handler

### Islands Architecture

Only interactive components require client-side JavaScript:

- **Islands** (`app/islands/` or `$` prefix): Components hydrated on client (use `useState`, event handlers)
- **Server Components** (pages/layouts): Plain JSX, server-rendered only
- **Zero JS by Default**: Pages without Islands have zero JavaScript sent to client

## Component Types

### 1. Page/Layout Components (Server)

Render on server only. No client-side interactivity.

```typescript
import { createRoute } from 'honox/factory'

export default createRoute(c => {
  const name = c.req.query('name') ?? 'Hono'
  return c.render(
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  )
})
```

**Benefits:**

- No JavaScript sent to client
- Can fetch data directly in component
- Optimal performance for static content

### 2. Island Components (Client)

Use `useState`, event handlers, client-side logic.
The `$` prefix marks this component as an Island, ensuring it's hydrated on the client.

**In `app/islands/` directory or `$` prefix in routes:**

```typescript
import { useState } from 'hono/jsx'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### 3. API Routes

Return JSON/data instead of rendering JSX.

```typescript
// app/routes/api/hello.ts
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.json({
    message: "Hello, HonoX!",
    timestamp: new Date().toISOString(),
  });
});
```

### 4. Dynamic Routes

Use `[param]` syntax for dynamic segments:

```typescript
// app/routes/posts/[id].tsx
import { createRoute } from 'honox/factory'
import PostLike from './$post-like'

export default createRoute(c => {
  const id = c.req.param('id')
  return c.render(
    <div>
      <title>Post {id}</title>
      <h1>Post ID: {id}</h1>
      <PostLike />
    </div>
  )
})
```

Access via: `/posts/123`, `/posts/hello`, etc.

## Global Layout (\_renderer.tsx)

Required file that wraps all routes with HTML structure.

```typescript
import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children }) => {
  return (
    <html lang='ja'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <Link href='/app/style.css' rel='stylesheet' />
        <Script src='/app/client.ts' async />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

### Script and Link Components

- `<Script>` - Inject client-side JavaScript (only needed if Islands exist)
- `<Link>` - Vite-aware asset linking (resolves paths from manifest)

These are automatically processed by Vite at build time.

## Tag Hoisting (Meta Tags)

HonoX automatically hoists `<title>` and `<meta>` tags from page components to `<head>`:

```typescript
export default createRoute(c => {
  return c.render(
    <div>
      <title>My Post Title</title>
      <meta name='description' content='...' />
      <h1>Content</h1>
    </div>
  )
})
```

**Rendered as:**

```html
<html>
  <head>
    <title>My Post Title</title>
    <meta name="description" content="..." />
  </head>
  <body>
    <div><h1>Content</h1></div>
  </body>
</html>
```

## Entry Points

### app/server.ts

Server-side initialization. Must export default Hono app or handler.

```typescript
import { createApp } from "honox/server";
import routes from "./routes";

const app = createApp();
app.route("/", routes);

export default app;
```

### app/client.ts

Client-side hydration. Registers Islands for hydration.

```typescript
import { startClient } from "honox/client";

startClient();
```

Automatically discovers and hydrates Island components.

## Data Flow Patterns

### Pattern 1: Server-Only Page

No Islands, no client JavaScript:

```
Page Component (render on server)
  ↓ (no Islands inside)
  ↓
Send HTML (zero JS)
```

### Pattern 2: Page with Islands

Server component contains Island components:

```
Page Component (SSR on server)
  ├─ Static content (h1, p, etc.)
  └─ Island Component
       ↓
       └─ Hydrate on client → Interactive
```

### Pattern 3: API + Client Fetch

Fetch data from API route on client-side:

```typescript
// Page component
export default createRoute(c => {
  return c.render(<MyComponent />)
})

// Island component (client-side fetch)
function MyComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])

  return <div>{JSON.stringify(data)}</div>
}
```

## Performance Best Practices

### 1. Minimize Islands

Only use Islands for truly interactive parts. Static content should be server-rendered.

```typescript
// ❌ Avoid: Island for static content
export function StaticText() {
  const [text] = useState('Hello')
  return <p>{text}</p>
}

// ✅ Good: Server component for static content
export function StaticText() {
  return <p>Hello</p>
}
```

### 2. Zero-JS Pages

For pages without Islands, JavaScript is automatically skipped. Ensure `Script` component is only in `_renderer.tsx`:

```typescript
// _renderer.tsx
<Script src='/app/client.ts' async />  // ✅ Only here
```

If no Islands exist on a page, `client.ts` won't execute for that page.

### 3. Lazy Load Heavy Components

For expensive computations, load only when needed:

```typescript
// ✅ Good: Lazy load expensive component
function Page() {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div>
      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        Show Advanced
      </button>
      {showAdvanced && <ExpensiveComponent />}
    </div>
  )
}
```

### 4. Use Vite's Code Splitting

Vite automatically splits code at import boundaries. Keep Islands separate from heavy utilities:

```typescript
// app/islands/chart.tsx (will be its own chunk)
import { Chart } from "heavy-chart-lib";

export default function ChartIsland() {
  // ...
}
```

## Common Patterns

### Pattern: Global State (if needed)

Use Context API with Islands:

```typescript
import { createContext } from 'hono/jsx'

export const GlobalContext = createContext({})

// Provider Island
export function Provider({ children }) {
  const [value, setValue] = useState({})
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}

// Consumer Island
export function Consumer() {
  const value = useContext(GlobalContext)
  // ...
}
```

### Pattern: Form Handling

Handle forms on server-side or with client Islands:

```typescript
// Server-side form handling
export default createRoute(c => {
  if (c.req.method === 'POST') {
    const data = await c.req.formData()
    // Process form
    return c.redirect('/success')
  }
  return c.render(<form method='post'>...</form>)
})

// Client-side form with Island
export function FormIsland() {
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/submit', { method: 'POST', body: new FormData(e.target) })
    setStatus(res.ok ? 'Success' : 'Error')
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Common Pitfalls

### ❌ Client Hooks in Server Components

```typescript
// ❌ WRONG: useState in non-Island component
export function BadComponent() {
  const [count, setCount] = useState(0)  // This won't work!
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Fix:** Place in `app/islands/` or use `$` prefix in routes.

### ❌ Forgetting $ Prefix for Islands in Routes

```typescript
// ❌ WRONG: Named like Island but placed in routes/ without $
// app/routes/button.tsx
export function InteractiveButton() {
  const [clicked, setClicked] = useState(0)
  return <button onClick={() => setClicked(clicked + 1)}>{clicked}</button>
}

// ✅ CORRECT: Use $ prefix
// app/routes/$button.tsx
export default function InteractiveButton() {
  const [clicked, setClicked] = useState(0)
  return <button onClick={() => setClicked(clicked + 1)}>{clicked}</button>
}
```

### ❌ Mixing Server and Client Logic

```typescript
// ❌ WRONG: Importing Island in server component causes issues
import Island from '../islands/heavy-island'

export default createRoute(c => {
  return c.render(
    <div>
      <Island />  // This tries to execute client code on server
    </div>
  )
})

// ✅ CORRECT: Islands are auto-discovered and hydrated
export default createRoute(c => {
  return c.render(
    <div>
      <MyIsland />  // Import from islands/ or use $ prefix
    </div>
  )
})
```

## Testing & Development

### HMR (Hot Module Replacement)

Vite provides fast HMR during development:

```bash
pnpm run dev
```

Changes to components and routes are reflected instantly in browser.

### Building

```bash
# Build both client and server
pnpm run build

# Preview production build
pnpm run preview

# Deploy to Cloudflare Workers
pnpm run deploy
```

## File Naming Conventions

| Pattern          | Purpose          | Example                              |
| ---------------- | ---------------- | ------------------------------------ |
| `index.tsx`      | Route handler    | `/posts/index.tsx` → `/posts/`       |
| `[param].tsx`    | Dynamic segment  | `/posts/[id].tsx` → `/posts/123`     |
| `$component.tsx` | Island in routes | `/posts/$like.tsx` (hydrated)        |
| `_renderer.tsx`  | Global layout    | Must be in `app/routes/`             |
| `_404.tsx`       | 404 handler      | Custom not-found page                |
| `_error.tsx`     | Error handler    | Custom error page                    |
| `.ts`            | API route        | `/api/endpoint.ts` → `/api/endpoint` |

## Project Structure Summary

```
app/
├─ islands/
│  ├─ counter.tsx
│  └─ [other-interactive-components]
├─ routes/
│  ├─ index.tsx               # Home page
│  ├─ posts/
│  │  ├─ [id].tsx            # Dynamic post page
│  │  └─ $post-like.tsx      # Island for inreactive component
│  ├─ api/
│  │  └─ hello.ts            # JSON endpoint
│  ├─ _renderer.tsx           # Global layout
│  ├─ _404.tsx                # Not found
│  └─ _error.tsx              # Error page
├─ components/                 # Shared server components
│  └─ header.tsx
├─ utils/                      # Utilities
│  └─ types.ts                # Shared types
├─ lib/                        # Shared libraries
│  └─ fetcher.ts              # Data fetching utilities
├─ client.ts                   # Client entry
├─ server.ts                   # Server entry
└─ global.d.ts                 # Type definitions

public/
├─ favicon.ico
└─ [static-assets]       # Static files (images, fonts, etc.)

seeds/                     # Seed data scripts and assets ( for local dev )
├── r2/                 # R2 seed files
├── d1/                 # d1 seed files
├── seed-local-r2.mjs   # R2 seeding script
├── seed-local-d1.mjs   # D1 seeding script
└── reset-local.mjs     # Reset local environment script

wrangler.jsonc
vite.config.ts
package.json
```

## References

- [HonoX GitHub](https://github.com/honojs/honox)
- [Hono Documentation](https://hono.dev/)
- [Vite Documentation](https://vitejs.dev/)
