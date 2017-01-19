'use strict'
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const convert = require('koa-convert')
const views = require('koa-views')
const debug = require('debug')

const ueditor = require('./middlewares/ueditor')

const log = debug('app:log')
const warn = debug('app:warn')
const error = debug('app:error')

const port = 8001

const app = new Koa()
// trust proxy
app.proxy = true

// log记录
app.use(convert(logger()))

// 外层处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.stack
    ctx.app.emit('error', err, ctx)
  }
})

// ueditor中间件，包括静态资源以及上传接口
app.use(ueditor())

app.use(views(path.join(__dirname, 'views/'), {
  extension: 'ejs',
}))

const router = new Router()

router.get('/', async (ctx) => {
  await ctx.render('index', {})
})

app.use(router.middleware())

app.on('error', (err) => {
  error('server error: %s', err.stack)
})

app.listen(port, () => {
  log(`App is now listening on ${port}`)
})


process.on('SIGINT', () => {
  process.exit()
})

export default app
