import { Context } from 'koa'

export interface Options {
  readonly encoding?: string
  readonly error?: (err: Error, ctx: Context) => void
  json?: string | string[]
  multipart?: string | string[]
  text?: string | string[]
  urlencoded?: string | string[]
}

declare module 'koa' {
  interface Request {
    body?: any
  }
}
