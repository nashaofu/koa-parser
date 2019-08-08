import Koa from 'koa'
import logger from 'koa-logger'
import parser from './src'
import { File, BodyObject } from './src/types'

const port = 3000
const app = new Koa()

app.use(logger())

app.use(
  parser({
    error (err, ctx): void {
      console.log(err)
      ctx.throw('custom parse error', 422)
    }
  })
)

app.use(
  async (ctx: Koa.Context, next): Promise<void> => {
    if (ctx.request.body !== undefined) {
      if ((ctx.request.body as BodyObject).file) {
        const file: File = (ctx.request.body as BodyObject).file as File
        console.log(file)
        console.log(file.toJSON())
        console.log(file.lastModifiedDate)
      }
      ctx.body = ctx.request.body
    }
    await next()
  }
)

app.listen(port)
console.error(`listening on port ${port}`)
