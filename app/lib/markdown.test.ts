import { describe, expect, it } from 'vitest'
import { isErr, isOk } from '../utils/types'
import { parseMarkdown } from './markdown'

describe('markdown processor utility', () => {
  it('should parse markdown with full frontmatter correctly', async () => {
    const rawContent = `---
title: Test Post
createdAt: 2024-02-01T00:00:00Z
updatedAt: 2024-02-02T00:00:00Z
isPublished: true
thumbnail: /images/test.png
tags: [test, hono]
version: 2
---
# Hello World
This is a test post.`

    const result = await parseMarkdown(rawContent)

    expect(isOk(result)).toBe(true)
    if (isOk(result)) {
      const data = result.value
      expect(data.title).toBe('Test Post')
      expect(data.isPublished).toBe(true)
      expect(data.tags).toEqual(['test', 'hono'])
      expect(data.version).toBe(2)
      // HTML conversion check
      expect(data.content).toContain('<h1>Hello World</h1>')
      expect(data.content).toContain('<p>This is a test post.</p>')
    }
  })

  it('should use default values when frontmatter is missing', async () => {
    const rawContent = '# Simple Post'

    const result = await parseMarkdown(rawContent)

    expect(isOk(result)).toBe(true)
    if (isOk(result)) {
      const data = result.value
      expect(data.title).toBe('Untitled')
      expect(data.isPublished).toBe(false)
      expect(data.tags).toEqual([])
      expect(data.content).toContain('<h1>Simple Post</h1>')
    }
  })

  it('should handle complex markdown features (lists, links)', async () => {
    const rawContent = `
- Item 1
- Item 2

[Link](https://hono.dev)
`
    const result = await parseMarkdown(rawContent)

    expect(isOk(result)).toBe(true)
    if (isOk(result)) {
      const data = result.value
      expect(data.content).toContain('<ul>')
      expect(data.content).toContain('<li>Item 1</li>')
      expect(data.content).toContain('<a href="https://hono.dev">Link</a>')
    }
  })

  it('should return error when something goes wrong during parsing', async () => {
    // @ts-expect-error - simulating invalid input at runtime
    const result = await parseMarkdown(null)

    expect(isErr(result)).toBe(true)
    if (isErr(result)) {
      expect(result.error).toBeDefined()
    }
  })
})
