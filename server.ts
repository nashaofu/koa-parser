import * as Koa from 'koa'
import * as logger from 'koa-logger'

import * as parser from './src'

const port = 3000
const app = new Koa()

app.use(logger())

app.use(parser({json: true}))

app.use(async (ctx: Koa.Context, next: () => Promise<void>) => {
  if (ctx.request.body !== undefined) {
    ctx.body = ctx.request.body
  }
  await next()
})

app.listen(port)
console.error(`listening on port ${port}`)
