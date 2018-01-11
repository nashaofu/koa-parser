import * as Koa from 'koa'
import parser from './parser'

export default ({
  encoding = 'utf-8', // 编码
  error = false, // 解析错误回调
  json = true, // 支持json解析
  multipart = true, // 支持form-data解析
  text = true, // 支持text解析
  urlencoded = true // 支持urlencoded解析
} = {}): Koa.Middleware => {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    // 已经被解析过的情况
    if (ctx.request.body !== undefined) {
      return await next()
    }

    try {
      // 存放请求体
      let body: any = {}
      if (json && ctx.is('json')) { // 解析json
        body = await parser.json(ctx, { encoding })
      } else if (urlencoded && ctx.is('urlencoded')) { // 解析urlencoded
        body = await parser.urlencoded(ctx, { encoding })
      } else if (text && ctx.is('text')) { // 解析text
        body = await parser.text(ctx, { encoding })
      } else if (multipart && ctx.is('multipart')) { // 解析multipart
        body = await parser.multipart(ctx, { encoding })
      }
      if (Object.keys(body).length) {
        ctx.request.body = body
      }
    } catch (err) {
      if (typeof error === 'function') {
        error(err, ctx)
      } else {
        throw err
      }
    }
    return await next()
  }
}
