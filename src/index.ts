import * as Koa from 'koa'
import * as parser from './parser'

const KoaParser = ({
  encoding = 'utf-8', // 编码
  error, // 解析错误回调
  json = [], // 支持json解析
  multipart = [], // 支持form-data解析
  text = [], // 支持text解析
  urlencoded = [] // 支持urlencoded解析
}: KoaParser.Options = {}): Koa.Middleware => {

  if (json && !Array.isArray(json)) {
    json = [json]
  }
  if (multipart && !Array.isArray(multipart)) {
    multipart = [multipart]
  }
  if (text && !Array.isArray(text)) {
    text = [text]
  }
  if (urlencoded && !Array.isArray(urlencoded)) {
    urlencoded = [urlencoded]
  }

  // 支持的json类型
  const jsonTypes: string[] = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
    ...json
  ]
  // 支持的multipart类型
  const multipartTypes: string[] = [
    'multipart/form-data',
    ...multipart
  ]
  // 支持的text类型
  const textTypes: string[] = [
    'text/plain',
    ...text
  ]
  // 支持的urlencode类型
  const urlencodedTypes: string[] = [
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
      if (ctx.is(jsonTypes)) { // 解析json
        body = await parser.json(ctx, { encoding })
      } else if (ctx.is(multipartTypes)) { // 解析multipart
        body = await parser.multipart(ctx, { encoding })
      } else if (ctx.is(textTypes)) { // 解析text
        body = await parser.text(ctx, { encoding })
      } else if (ctx.is(urlencodedTypes)) { // 解析urlencoded
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

export = KoaParser
