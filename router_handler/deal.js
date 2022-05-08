/* 在这里定义和交易相关的路由处理函数，供 /router/deal.js 模块进行调用*/
const fs = require('fs-extra')
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

//定义购买商品的逻辑
exports.buy = (req, res) => {
  let { buyer, id, seller } = req.body
  //交易时间
  let tradingTime = new Date().getTime()
  //订单号
  let orderNumber = parseInt(Math.random() * 999) + parseInt(Math.random() * 2222) + tradingTime * 10000;
  console.log(tradingTime)
  console.log(orderNumber)
  //订单结构
  let newTransaction = {
    buyer,
    seller,
    tradingTime,
    orderNumber,
    id,
    status: 'ongoing'
  }
  console.log(newTransaction)
  //写入订单
  fs.readJSON('./data/transactions.json', (err, obj) => {
    obj.push(newTransaction)
    fs.writeJSON('./data/transactions.json', obj, err => {
      if (err) {
        console.log(err)
        throw (err)
        // return res.send(err)
      }
      console.log('write newTransaction success')
    })
    if (err) {
      console.log(err)
      throw (err)

      // return res.send(err)
    }
  })
  //修改商品信息
  fs.readJson('./data/goods.json', (err, obj) => {
    let index = obj.findIndex((item) => item.id == id)
    console.log(index)
    //修改商品状态为0  代表ongoing
    obj[index].status = 0
    fs.writeJSON('./data/goods.json', obj, err => {
      if (err) {
        console.log(err)
        return res.send(err)
      }
      console.log('edit goods.status(0) success')
    })
    if (err) {
      console.log(err)
      return res.send(err)
    }
  })
  //修改用户信息  将订单号分别插入买家和卖家的信息
  fs.readJson('./data/users.json', (err, obj) => {
    let sellerIndex = obj.findIndex((item) => item.username === seller)
    obj[sellerIndex].sellOrderNumber.push(orderNumber)
    console.log(obj[sellerIndex], 'this is sellerInfo')

    let buyerIndex = obj.findIndex((item) => item.username === buyer)
    obj[buyerIndex].buyOrderNumber.push(orderNumber)
    obj[buyerIndex].buyid.push(id)
    console.log(obj[buyerIndex], 'this is buyerInfo')

    fs.writeJSON('./data/users.json', obj, err => {
      if (err) return res.send(err)
      console.log('insert orderNumber success')
      // return res.send('edit success')
    })

    if (err) return res.send(err)
    // return res.send(userInfo)
  })

  return res.send({ status: 0, message: '订单已提交！' })
}

exports.completeTransaction = (req, res) => {
  // try {
  let { orderNumber, id } = req.body
  console.log(orderNumber, id)
  //修改transactions订单状态
  fs.readJson('./data/transactions.json', (err, obj) => {
    let index = obj.findIndex((item) => item.orderNumber == orderNumber)
    // console.log(obj[index])
    //修改订单状态为completed
    obj[index].status = 'completed'
    fs.writeJSON('./data/transactions.json', obj, err => {
      if (err) {
        return res.send(err)
      }
      console.log('edit transactions.status(completed) success')
    })
    if (err) {
      return res.send(err)
    }
  })
  //修改商品状态
  fs.readJson('./data/goods.json', (err, obj) => {
    let index = obj.findIndex((item) => item.id == id)
    console.log(index)
    //修改商品状态为0  代表ongoing
    obj[index].status = -1
    fs.writeJSON('./data/goods.json', obj, err => {
      if (err) {
        return res.send(err)
      }
      console.log('edit goods.status(-1) success')
    })
    if (err) {
      return res.send(err)
    }
  })

  // if (err) console.log(err)
  return res.send({ status: 0, message: '订单已完成！' })
}


exports.cancelTransaction = (req, res) => {
  let { orderNumber, id } = req.body
  // console.log(orderNumber, id)
  //修改transactions订单状态
  fs.readJson('./data/transactions.json', (err, obj) => {
    let index = obj.findIndex((item) => item.orderNumber == orderNumber)
    // console.log(obj[index])
    //修改订单状态为cancel
    obj[index].status = 'cancel'
    fs.writeJSON('./data/transactions.json', obj, err => {
      if (err) {
        return res.send(err)
      }
      console.log('edit transactions.status(cancel) success')
    })
    if (err) {
      return res.send(err)
    }
  })
  //修改商品状态
  fs.readJson('./data/goods.json', (err, obj) => {
    let index = obj.findIndex((item) => item.id == id)
    console.log(index)
    //修改商品状态为0  代表selling
    obj[index].status = 1
    fs.writeJSON('./data/goods.json', obj, err => {
      if (err) {
        // throw err
        return res.send(err)
      }
      console.log('edit goods.status(1) success')
    })
    if (err) {
      return res.send(err)
    }
  })
  return res.send({ status: 0, message: '订单已取消！' })
}