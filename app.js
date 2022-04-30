// 导入 express 模块
const express = require('express')
// var unless = require('express-unless');
// 创建 express 的服务器实例
const app = express()
const joi = require('joi')
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))
// 导入并注册用户路由模块

// 在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      //判断err是不是Error的实例 还是字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/] }))

// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/data/] }))
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/public/, /api/] }))

const goodsRouter = require('./router/goods')
const userRouter = require('./router/user')
const uploadRouter = require('./router/upload')
const dealRouter = require('./router/deal')
app.use('/api', dealRouter)
app.use('/api', uploadRouter)
app.use('/api', userRouter)
app.use('/api', goodsRouter)

// app.use(express.static('public'))
app.use('/public', express.static(__dirname + '/public'));

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})



// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3000, function () {
  // console.log('api server running at http://127.0.0.1:3000')
})
