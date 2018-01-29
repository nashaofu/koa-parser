declare namespace KoaParser {
  export interface Options {
    readonly encoding?: string
    readonly error?: (err: any, ctx: any) => any
    json?: string | string[]
    multipart?: string | string[]
    text?: string | string[]
    urlencoded?: string | string[]
  }
}
