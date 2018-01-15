import * as Koa from 'koa'
import * as parser from '../src'
import * as supertest from 'supertest'

describe('test', () => {
  let app
  beforeEach(function () {
    app = new Koa()
    app.use(parser())
  })

  describe('json', () => {
    test('should parse json body ok', done => {
      app.use(async (ctx, next) => {
        expect(ctx.request.body).toEqual({
          str: 'str',
          arr: ['arr1', 'arr2'],
          obj: { key: 'val' }
        })
        ctx.body = ctx.request.body
        await next()
      })

      supertest(app.listen())
        .post('/')
        .send({
          str: 'str',
          arr: ['arr1', 'arr2'],
          obj: { key: 'val' }
        }).expect({
          str: 'str',
          arr: ['arr1', 'arr2'],
          obj: { key: 'val' }
        }, done)
    })

    test('should parse json body with json-api headers ok', done => {
      app.use(async (ctx) => {
        expect(ctx.request.body).toEqual({ str: 121 })
        ctx.body = ctx.request.body
      })

      supertest(app.listen())
        .post('/')
        .set('Accept', 'application/vnd.api+json')
        .set('Content-type', 'application/vnd.api+json')
        .send('{"str": 121}')
        .expect({ str: 121 }, done)
    })

    test('should parse json patch', done => {
      app.use(async (ctx) => {
        expect(ctx.request.body).toEqual([{ op: 'add', path: '/foo', value: 'bar' }])
        ctx.body = ctx.request.body
      })
      supertest(app.listen())
        .patch('/')
        .set('Content-type', 'application/json-patch+json')
        .send('[{"op": "add", "path": "/foo", "value": "bar"}]')
        .expect([{ op: 'add', path: '/foo', value: 'bar' }], done)
    })
  })

  // describe('text', () => {

  // })
})
