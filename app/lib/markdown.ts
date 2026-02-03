import grayMatter from 'gray-matter'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { err, ok, type Result } from '../utils/types'

type PostData = {
  title: string
  createdAt: string
  updatedAt?: string
  content: string
  isPublished: boolean
  thumbnail?: string
  tags?: string[]
  version?: number
  [key: string]: any
}

export async function parseMarkdown(
  rawContent: string,
): Promise<Result<PostData, string>> {
  try {
    const { data, content } = grayMatter(rawContent)

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(content)

    const postData: PostData = {
      title: data.title || 'Untitled',
      createdAt:
        data.createdAt instanceof Date
          ? data.createdAt.toISOString()
          : data.createdAt || new Date().toISOString(),
      updatedAt:
        data.updatedAt instanceof Date
          ? data.updatedAt.toISOString()
          : data.updatedAt || undefined,
      isPublished: data.isPublished ?? false,
      thumbnail: data.thumbnail,
      tags: data.tags || [],
      version: data.version || 1,
      content: processedContent.toString(),
      ...data,
    }

    return ok(postData)
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Unknown error')
  }
}
