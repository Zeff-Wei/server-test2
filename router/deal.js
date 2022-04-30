const express = require('express')
const deal = express.Router()

// 导入用户路由处理函数模块
const dealHandler = require('../router_handler/deal')

// 购买
deal.post('/buy', dealHandler.buy)
//完成交易
deal.post('/completeTransaction', dealHandler.completeTransaction)
//取消交易
deal.post('/cancelTransaction', dealHandler.cancelTransaction)
module.exports = deal
