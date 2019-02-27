declare module 'koa' {
  interface Request {
    body?: any
  }
}

export interface Options {
  readonly encoding?: string
  readonly error?: (err: any, ctx: any) => void
  json?: string | string[]
  multipart?: string | string[]
  text?: string | string[]
  urlencoded?: string | string[]
}
