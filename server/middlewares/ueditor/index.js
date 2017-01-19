/**
 * ueditor中间件，包含静态资源的serve，editor初始化config接口，和上传接口
 * 注意点：ueditor下的dialogs/image/image.js#373 这行是改过源码的，把文件类型一一罗列出来，否则弹出文件选择器会很慢
 * 源码： mimeTypes: 'image/*'
 * 更改后：mimeTypes: 'image/gif,image/png,image/jpeg'
 */
const path = require('path')
const mount = require('koa-mount')
const serve = require('koa-static')
const bodyParser = require('koa-body')
const compose = require('koa-compose')
const upload = require('../upyun-upload')

// 默认配置
const DEFAULT_OPTIONS = {
  path: '/api/ueditor',
  filename: 'upfile'
}
module.exports = function (options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  const editorResources = mount('/static/libraries', serve(path.join(__dirname, '../../../libraries')))

  // editor初始化的时候，会自动发送一个config请求，用于获取一些配置，否则无法使用上传的一些功能
  async function editorConfig(ctx, next) {
    if (!(
      ctx.method === 'GET' &&
      ctx.path === options.path &&
      ctx.query.action === 'config')) {
      return next()
    }
    ctx.body = require('./config')
  }

  // 真正处理上传的小中间件
  async function uploader(ctx) {
    console.log(777)
    let uploadRet = await upload(ctx.request.body.files[options.filename])
    // 必须添加这一头，否则浏览器会添加pre标签，导致编辑器解析出错
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    // 这里也必须序列化过才行，否则最终响应的Content-type是application/json
    ctx.body = JSON.stringify(uploadRet)
  }

  // 处理上传请求
  async function editorUpload(ctx, next) {
    console.log(ctx.method === 'POST')
    console.log(ctx.path === options.path)
    if (!(ctx.method === 'POST' && ctx.path === options.path)) {
      return next()
    }
    console.log(99)
    // 这里直接执行compose的结果很重要！
    return compose([
      bodyParser({ multipart: true, formidable: { hash: 'md5' } }),
      uploader
    ])(ctx, next)
  }

  return compose([
    editorResources,
    editorConfig,
    editorUpload
  ])
}