import { matter } from 'gray-matter-es'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { err, ok, type Result } from '../utils/types'

type PostData = {
  title: string
  createdAt: string
  updatedAt?: string
  isPublished: boolean
  thumbnail?: string
  tags?: string[]
  version?: number
  [key: string]: any
  content: string
}

export async function parseMarkdown(
  rawContent: string,
): Promise<Result<PostData, string>> {
  try {
    if (!rawContent || rawContent.trim() === '') {
      return err('Empty markdown content')
    }

    const file = matter(rawContent)
    const data = file.data as Record<string, any>

    const content = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(file.content)
    if (!content) {
      return err('Failed to process markdown content')
    }

    const postData: PostData = {
      title: data.title ?? 'Untitled',
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? new Date().toISOString(),
      isPublished: data.isPublished ?? false,
      thumbnail: data.thumbnail ?? '',
      tags: data.tags ?? [],
      version: data.version ?? 1,
      ...data,
      content: content.toString(),
    }

    return ok(postData)
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Unknown error')
  }
}
