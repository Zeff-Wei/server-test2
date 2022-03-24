const express = require('express')
const user = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 注册新用户
user.post('/reguser', userHandler.regUser)
// 登录
user.post('/login', userHandler.login)

module.exports = user
