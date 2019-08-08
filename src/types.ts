import { Context } from 'koa'
import { File } from 'formidable'

export type BodyBase = number | string | object | File
export type BodyArray = BodyBase[]

export interface Body {
  [key: string]: BodyBase | BodyArray
}

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
    body?: Body
  }
}

export { File }
