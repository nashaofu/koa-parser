import { Context } from 'koa'
import { IncomingForm } from 'formidable'
import { form, json, text, Options } from 'co-body'

const multipart = (ctx: Context, { encoding = 'utf-8' }: Options): Promise<any> => {
  return new Promise((resolve, reject) => {
    const formidable: IncomingForm = new IncomingForm()
    // 设置编码
    formidable.encoding = encoding

    // 存放请求体
    const body: any = {}
    formidable
      .on('field', (field, value) => {
        if (body[field]) {
          if (Array.isArray(body[field])) {
            body[field].push(value)
          } else {
            body[field] = [body[field], value]
          }
        } else {
          body[field] = value
        }
      })
      .on('file', (field, file) => {
        if (body[field]) {
          if (Array.isArray(body[field])) {
            body[field].push(file)
          } else {
            body[field] = [body[field], file]
          }
        } else {
          body[field] = file
        }
      })
      .on('end', () => resolve(body))
      .on('error', err => reject(err))

    // 执行解析
    formidable.parse(ctx.req)
  })
}

export default {
  json,
  multipart,
  text,
  urlencoded: form
}
