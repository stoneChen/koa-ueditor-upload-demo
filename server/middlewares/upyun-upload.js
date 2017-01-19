/**
 * 又拍云上传封装
 */
const path = require('path')
const UpYun = require('upyun')
const moment = require('moment')
const debug = require('debug')

const log = debug('upload:debug')
const error = debug('upload:error')


let upyunConfig = require(path.join(process.cwd(), 'upyun.config.js'))
if (!upyunConfig) {
  throw new Error('Upyun config DOES NOT exist!')
}

log(`Using bucket: "${upyunConfig.bucket}"`)

// 实例化upyun对象
let upyun = new UpYun(
  upyunConfig.bucket,
  upyunConfig.operator,
  upyunConfig.password,
  upyunConfig.endpoint,
  upyunConfig.options
)

const UPYUN_ORIGIN = `http://${upyunConfig.bucket}.b0.upaiyun.com`

/**
 * 此处file对象来自 koa-body => node_modules/formidable/lib/file.js
 * @param {File} file - file对象
 * @returns {Promise} promise
 */
module.exports = function upload(file) {
  return new Promise((resolve, reject) => {
    // 默认后缀jpg
    let ext = path.extname(file.name) || '.jpg'
    let fileName = `${file.hash}${ext}`
    let remotePath = `/uploads/${moment().format('YYYYMMDD')}/${fileName}`
    upyun.putFile(remotePath, file.path, null, false, null, (err, result) => {
      if (err) {
        reject({
          state: 'FAIL',
          msg: err
        })
        error('Error when uploading:', err)
        return
      }
      if (result && result.data) {
        reject({
          state: 'FAIL',
          msg: result.data.msg
        })
        return
      }
      log(`File uploading SUCCESS: "${file.name}" ==> "${UPYUN_ORIGIN}${remotePath}"`)
      resolve({
        state: 'SUCCESS',
        originalName: file.name,
        name: fileName,
        type: ext,
        size: file.size,
        url: `${UPYUN_ORIGIN}${remotePath}`
      })
    })
  })
}
