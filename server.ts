import Koa from 'koa'
import logger from 'koa-logger'
import parser from './src'

const port = 3000
const app = new Koa()

app.use(logger())

// app.use(async (ctx, next) => {
//   ctx.request.body = 'hello'
//   await next()
// })

app.use(
  parser({
    error (err, ctx) {
      ctx.throw('custom parse error', 422)
    }
  })
)

app.use(async (ctx: Koa.Context, next) => {
  if (ctx.request.body !== undefined) {
    ctx.body = ctx.request.body
  }
  await next()
})

app.listen(port)
console.error(`listening on port ${port}`)
