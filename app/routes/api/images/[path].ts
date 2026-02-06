import { createRoute } from 'honox/factory'
import { getAsset } from '../../../lib/r2'
import { isErr } from '../../../utils/types'

export default createRoute(async c => {
  let path = c.req.path
  const prefix = '/api/'
  if (path.startsWith(prefix)) {
    path = path.slice(prefix.length)
  }

  if (!path) return c.notFound()

  const bucket = c.env.BLOG_BUCKET

  const result = await getAsset(bucket, path)

  if (isErr(result)) return c.notFound()

  const object = result.value

  // Set appropriate headers
  if (object.httpMetadata?.contentType) {
    c.header('Content-Type', object.httpMetadata.contentType)
  }
  if (object.httpEtag) {
    c.header('ETag', object.httpEtag)
  }
  // Cache for 7 days
  c.header('Cache-Control', 'public, max-age=604800')

  return c.body(object.body)
})
