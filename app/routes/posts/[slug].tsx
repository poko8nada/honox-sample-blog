import { createRoute } from 'honox/factory'
import { parseMarkdown } from '../../lib/markdown'
import { getPost } from '../../lib/r2'
import { isErr } from '../../utils/types'

const PostComponent = async ({
  bucket,
  slug,
}: {
  bucket: R2Bucket
  slug: string
}) => {
  const getResult = await getPost(bucket, slug)
  if (isErr(getResult)) {
    return <div>Error: {getResult.error}</div>
  }

  const content = getResult.value
  const parseResult = await parseMarkdown(content)

  console.log(parseResult)
  if (isErr(parseResult)) {
    return <div>Error: {parseResult.error}</div>
  }

  const postData = parseResult.value

  return (
    <article>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.content }} />
    </article>
  )
}

export default createRoute(c => {
  const slug = c.req.param('slug')
  if (!slug) {
    return c.render(<div>Error: Missing slug parameter</div>)
  }
  return c.render(
    <div class='prose'>
      <PostComponent bucket={c.env.BLOG_BUCKET} slug={slug} />
    </div>,
  )
})
