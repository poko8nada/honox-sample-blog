import { describe, expect, it, vi } from 'vitest'
import { isErr, isOk } from '../utils/types'
import { getAsset, getPost, listPosts } from './r2'

// R2Bucket のシンプルなモックを作成
const createMockBucket = (overrides: Partial<R2Bucket> = {}): R2Bucket => {
  return {
    get: vi.fn(),
    list: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    head: vi.fn(),
    ...overrides,
  } as unknown as R2Bucket
}

describe('r2 client utility', () => {
  describe('getPost', () => {
    it('should return post content when file exists', async () => {
      const mockText = '# Hello World'
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue({
          text: () => Promise.resolve(mockText),
        }),
      })

      const result = await getPost(mockBucket, 'hello')

      expect(isOk(result)).toBe(true)
      if (isOk(result)) {
        expect(result.value).toBe(mockText)
      }
      // Ensure the correct key is used with the 'posts/' prefix
      expect(mockBucket.get).toHaveBeenCalledWith('posts/hello.md')
    })

    it('should return error when file does not exist', async () => {
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(null),
      })

      const result = await getPost(mockBucket, 'non-existent')

      expect(isErr(result)).toBe(true)
      if (isErr(result)) {
        expect(result.error).toContain('Post not found')
      }
    })

    it('should return error when bucket.get throws', async () => {
      const mockBucket = createMockBucket({
        get: vi.fn().mockRejectedValue(new Error('Network error')),
      })

      const result = await getPost(mockBucket, 'error')

      expect(isErr(result)).toBe(true)
      if (isErr(result)) {
        expect(result.error).toBe('Network error')
      }
    })
  })

  describe('listPosts', () => {
    it('should return list of slugs from posts/ prefix', async () => {
      const mockBucket = createMockBucket({
        list: vi.fn().mockResolvedValue({
          objects: [
            { key: 'posts/post-1.md' },
            { key: 'posts/post-2.md' },
            { key: 'posts/not-a-markdown.txt' },
          ],
        }),
      })

      const result = await listPosts(mockBucket)

      expect(isOk(result)).toBe(true)
      if (isOk(result)) {
        expect(result.value).toEqual(['post-1', 'post-2'])
      }
      expect(mockBucket.list).toHaveBeenCalledWith({ prefix: 'posts/' })
    })

    it('should return empty list when no objects found', async () => {
      const mockBucket = createMockBucket({
        list: vi.fn().mockResolvedValue({ objects: [] }),
      })

      const result = await listPosts(mockBucket)

      expect(isOk(result)).toBe(true)
      if (isOk(result)) {
        expect(result.value).toEqual([])
      }
    })
  })

  describe('getAsset', () => {
    it('should return R2Object when asset exists', async () => {
      const mockObject = { key: 'images/test.png' }
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(mockObject),
      })

      const result = await getAsset(mockBucket, 'images/test.png')

      expect(isOk(result)).toBe(true)
      if (isOk(result)) {
        expect(result.value).toEqual(mockObject)
      }
      expect(mockBucket.get).toHaveBeenCalledWith('images/test.png')
    })

    it('should return error when asset does not exist', async () => {
      const mockBucket = createMockBucket({
        get: vi.fn().mockResolvedValue(null),
      })

      const result = await getAsset(mockBucket, 'images/missing.png')

      expect(isErr(result)).toBe(true)
      if (isErr(result)) {
        expect(result.error).toContain('Asset not found')
      }
    })
  })
})
