import * as Koa from 'koa'
import * as parser from './parser'

const Parser = ({
  encoding = 'utf-8', // 编码
  error, // 解析错误回调
  json = [], // 支持json解析
  multipart = [], // 支持form-data解析
  text = [], // 支持text解析
  urlencoded = [] // 支持urlencoded解析
}: {
  encoding?: string
  error?: (err: any, ctx: Koa.Context) => any
  json?: string[]
  multipart?: string[]
  text?: string[]
  urlencoded?: string[]
} = {}): Koa.Middleware => {
  json = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
    ...json
  ]

  multipart = [
    'multipart/form-data',
    ...multipart
  ]

  text = [
    'text/plain',
    ...text
  ]

  urlencoded = [
    'application/x-www-form-urlencoded',
    ...urlencoded
  ]
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    // 已经被解析过的情况
    if (ctx.request.body !== undefined) {
      return await next()
    }
    try {
      // 存放请求体
      let body: any = {}
      if (ctx.is(json)) { // 解析json
        body = await parser.json(ctx, { encoding })
      } else if (ctx.is(multipart)) { // 解析multipart
        body = await parser.multipart(ctx, { encoding })
      } else if (ctx.is(text)) { // 解析text
        body = await parser.text(ctx, { encoding })
      } else if (ctx.is(urlencoded)) { // 解析urlencoded
        body = await parser.urlencoded(ctx, { encoding })
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

export = Parser
