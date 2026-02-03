import { createRoute } from 'honox/factory'
import { listPosts } from '../lib/r2'
import { isErr } from '../utils/types'

const ListComponent = async ({ bucket }: { bucket: R2Bucket }) => {
  const list = await listPosts(bucket)
  console.log(list)
  if (isErr(list)) {
    return <div>Error: {list.error}</div>
  }

  return (
    <div>
      <ul>
        {list.value.map(slug => (
          <li key={slug} class='prose'>
            <a href={`/posts/${slug}`}>{slug}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default createRoute(c => {
  const name = c.req.query('name') ?? 'Hono'
  return c.render(
    <div class='prose'>
      <title>{name}</title>
      <ListComponent bucket={c.env.BLOG_BUCKET} />
    </div>,
  )
})
