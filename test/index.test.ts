import Koa from 'koa'
import parser from '../src'
import { Server } from 'net'
import supertest from 'supertest'

describe('test width default', (): void => {
  let app: Koa
  let server: Server
  beforeEach(
    (): void => {
      app = new Koa()
      app.use(parser())
    }
  )

  afterEach(
    (): void => {
      server.close()
    }
  )

  describe('json', (): void => {
    it('should parse json body ok', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toEqual({
            obj: { key: 'val' },
            str: 'str'
          })
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .send({
          obj: { key: 'val' },
          str: 'str'
        })
        .expect(
          {
            obj: { key: 'val' },
            str: 'str'
          },
          done
        )
    })

    it('should parse json patch', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toEqual([{ op: 'add', path: '/foo', value: 'bar' }])
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .patch('/')
        .set('Content-type', 'application/json-patch+json')
        .send(JSON.stringify([{ op: 'add', path: '/foo', value: 'bar' }]))
        .expect([{ op: 'add', path: '/foo', value: 'bar' }], done)
    })

    it('should parse json body with json-api headers ok', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toEqual({ str: 121 })
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-type', 'application/vnd.api+json')
        .send('{"str": 121}')
        .expect({ str: 121 }, done)
    })

    it('should work when use parser again', (done): void => {
      app.use(parser())
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toEqual({
            obj: { key: 'val' },
            str: 'str'
          })
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .send({
          obj: { key: 'val' },
          str: 'str'
        })
        .expect(
          {
            obj: { key: 'val' },
            str: 'str'
          },
          done
        )
    })
  })

  describe('multipart', (): void => {
    it('should parse multipart body ok', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toMatchObject({
            firstField: expect.any(Object),
            names: expect.arrayContaining(['John', 'Paul'])
          })
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .type('multipart/form-data')
        .field('names', 'John')
        .field('names', 'Paul')
        .attach('firstField', 'package.json')
        .expect(200)
        .end(
          (err, res): void => {
            if (err) {
              return done(err)
            }
            expect(res.body).toMatchObject({
              firstField: expect.any(Object),
              names: expect.arrayContaining(['Paul', 'John'])
            })
            done()
          }
        )
    })
  })

  describe('text', (): void => {
    it('should parse text body ok', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toBe('text')
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .type('text')
        .send('text')
        .expect('text', done)
    })
  })

  describe('urlencoded', (): void => {
    it('should parse urlencoded body ok', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toEqual({ foo: { bar: 'baz' } })
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .type('form')
        .send({ foo: { bar: 'baz' } })
        .expect({ foo: { bar: 'baz' } }, done)
    })
  })
})

describe('error and not parser', (): void => {
  let app: Koa
  let server: Server
  beforeEach(
    (): void => {
      app = new Koa()
    }
  )
  afterEach(
    (): void => {
      server.close()
    }
  )

  it('should get custom error message', (done): void => {
    app.use(
      parser({
        error (err, ctx): void {
          ctx.throw('custom parse error', 422)
          console.log(err)
        }
      })
    )

    app.use(
      async (ctx, next): Promise<void> => {
        await next()
      }
    )

    server = app.listen()
    supertest(server)
      .post('/')
      .send('test')
      .set('content-type', 'application/json')
      .expect(422)
      .expect('custom parse error', done)
  })

  describe('not parser', (): void => {
    it('should not parse body when ctx.request.body have been set up', (done): void => {
      app.use(
        async (ctx, next): Promise<void> => {
          ctx.request.body = 'hello'
          await next()
        }
      )
      app.use(parser())
      app.use(
        async (ctx, next): Promise<void> => {
          expect(ctx.request.body).toBe('hello')
          ctx.body = ctx.request.body
          await next()
        }
      )

      server = app.listen()
      supertest(server)
        .post('/')
        .send({ foo: 'bar' })
        .set('content-type', 'application/json')
        .expect(200)
        .expect('hello', done)
    })
  })
})

describe('test type', (): void => {
  let app: Koa
  let server: Server
  beforeEach(
    (): void => {
      app = new Koa()
    }
  )
  afterEach(
    (): void => {
      server.close()
    }
  )

  it('should extent json with string ok', (done): void => {
    app.use(
      parser({
        json: 'application/x-javascript'
      })
    )

    app.use(
      async (ctx, next): Promise<void> => {
        expect(ctx.request.body).toEqual({ foo: 'bar' })
        ctx.body = ctx.request.body
        await next()
      }
    )
    server = app.listen()
    supertest(server)
      .post('/')
      .type('application/x-javascript')
      .send(JSON.stringify({ foo: 'bar' }))
      .expect({ foo: 'bar' }, done)
  })

  it('should extent json with array ok', (done): void => {
    app.use(
      parser({
        json: ['application/x-javascript', 'application/y-javascript']
      })
    )

    app.use(
      async (ctx, next): Promise<void> => {
        ctx.body = ctx.request.body
        await next()
      }
    )

    server = app.listen()
    supertest(server)
      .post('/')
      .type('application/x-javascript')
      .send(JSON.stringify({ foo: 'bar' }))
      .expect({ foo: 'bar' }, done)
  })

  it('should get 404', (done): void => {
    app.use(parser())
    app.use(
      async (ctx, next): Promise<void> => {
        expect(ctx.request.body).toBe(undefined)
        ctx.body = ctx.request.body
        await next()
      }
    )

    server = app.listen()
    supertest(server)
      .post('/')
      .type('application/x-javascript')
      .send(JSON.stringify({ foo: 'bar' }))
      .expect(204)
      .expect('', done)
  })
})
