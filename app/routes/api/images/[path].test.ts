import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'
import route from './[path]'

// Create a simple mock for R2Bucket
const createMockBucket = (overrides: Partial<R2Bucket> = {}): R2Bucket => {
  return {
    get: vi.fn(),
    list: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    head: vi.fn(),
    createMultipartUpload: vi.fn(),
    resumeMultipartUpload: vi.fn(),
    ...overrides,
  } as unknown as R2Bucket
}

// Create test app with the route handler
// createRoute returns an array of handlers, so we spread it
const createTestApp = () => {
  const app = new Hono<{ Bindings: { BLOG_BUCKET: R2Bucket } }>()
  app.all('/api/*', ...route)
  return app
}

describe('API [...path] route', () => {
  describe('successful asset retrieval', () => {
    it('should return asset with correct headers when found', async () => {
      const mockBody = new ReadableStream()
      const mockObject = {
        body: mockBody,
        httpMetadata: { contentType: 'image/png' },
        httpEtag: '"abc123"',
      }
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(mockObject),
      })

      const app = createTestApp()
      const res = await app.request(
        '/api/images/test.png',
        {},
        { BLOG_BUCKET: mockBucket },
      )

      expect(res.status).toBe(200)
      expect(res.headers.get('Content-Type')).toBe('image/png')
      expect(res.headers.get('ETag')).toBe('"abc123"')
      expect(res.headers.get('Cache-Control')).toBe('public, max-age=604800')
      expect(mockBucket.get).toHaveBeenCalledWith('images/test.png')
    })

    it('should handle asset without httpMetadata', async () => {
      const mockBody = new ReadableStream()
      const mockObject = {
        body: mockBody,
        httpMetadata: {},
        httpEtag: '"def456"',
      }
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(mockObject),
      })

      const app = createTestApp()
      const res = await app.request(
        '/api/docs/file.pdf',
        {},
        { BLOG_BUCKET: mockBucket },
      )

      expect(res.status).toBe(200)
      expect(res.headers.get('Content-Type')).toBeNull()
      expect(res.headers.get('ETag')).toBe('"def456"')
      expect(mockBucket.get).toHaveBeenCalledWith('docs/file.pdf')
    })

    it('should handle nested paths correctly', async () => {
      const mockBody = new ReadableStream()
      const mockObject = {
        body: mockBody,
        httpMetadata: { contentType: 'text/plain' },
      }
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(mockObject),
      })

      const app = createTestApp()
      const res = await app.request(
        '/api/deep/nested/path/file.txt',
        {},
        { BLOG_BUCKET: mockBucket },
      )

      expect(res.status).toBe(200)
      expect(mockBucket.get).toHaveBeenCalledWith('deep/nested/path/file.txt')
    })
  })

  describe('error cases', () => {
    it('should return 404 when asset not found', async () => {
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(null),
      })

      const app = createTestApp()
      const res = await app.request(
        '/api/images/missing.png',
        {},
        { BLOG_BUCKET: mockBucket },
      )

      expect(res.status).toBe(404)
    })

    it('should return 404 when bucket.get throws error', async () => {
      const mockBucket = createMockBucket({
        get: vi.fn().mockRejectedValue(new Error('R2 error')),
      })

      const app = createTestApp()
      const res = await app.request(
        '/api/images/error.png',
        {},
        { BLOG_BUCKET: mockBucket },
      )

      expect(res.status).toBe(404)
    })
  })
})
