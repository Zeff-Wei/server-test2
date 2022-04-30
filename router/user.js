const express = require('express')
const user = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 注册新用户
user.post('/reguser', userHandler.regUser)
// 登录
user.post('/login', userHandler.login)
//获取用户信息
user.post('/getUserInfo', userHandler.getUserInfo)
//root用户登录
user.post('/rootLogin', userHandler.rootLogin)
module.exports = user
