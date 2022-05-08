/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const fs = require('fs-extra')
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
const { nanoid } = require('nanoid')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  let { username, password, phoneNumber } = req.body
  console.log(req.body, phoneNumber, 'this is reguser')
  // 判断数据是否合法
  if (!username || !password) {
    return res.send({ status: 1, message: '用户名/密码不能为空！' })
  } else {
    fs.readJson('./data/users.json', (err, obj) => {
      //对比数据['username','phongNumber']并返回对应数据
      const getUsername = (username) => obj.find(res => res.username === username);
      const getPhoneNumber = (phoneNumber) => obj.find(res => (res.phoneNumber === phoneNumber));
      if (getUsername(username) || getPhoneNumber(phoneNumber)) { return res.send({ status: 1, message: '用户名/手机号已被占用' }) }
      else {
        //密码加密
        password = bcrypt.hashSync(password, 10)
        //用户数据结构
        let newUser = {
          username,
          password,
          phoneNumber,
          userid: nanoid(),
          avatar: 'http://www.wulies.xyz:3001/public/avatar/nopic.png',
          sellid: [],
          buyid: [],
          sellOrderNumber: [],
          buyOrderNumber: [],
          //收藏
          collect: []
        }
        obj.push(newUser)
        //写入新用户
        fs.writeJSON('./data/users.json', obj, err => {
          if (err) throw err
          // console.log('success')
        })
        if (err) throw err
        return res.send({ status: 0, message: 'reguser OK' })
      }


    })
  }
}

// 登录的处理函数
exports.login = (req, res) => {
  console.log(req.body, 'this.is login')
  // 接收表单数据
  let { username, password } = req.body
  // 判断数据是否合法
  if (!username || !password) {
    return res.send({ status: 1, message: '用户名/密码/手机号不能为空！' })
  } else {
    fs.readJson('./data/users.json', (err, obj) => {
      //对比['username','phongNumber']并返回对应数据
      // console.log(obj)
      const getUser = (username) => obj.find(res => (res.username === username) || (res.phoneNumber === username))
      console.log(getUser(username))
      let user = getUser(username)
      if (!user) return res.send({ status: 1, message: '未找到用户' })
      //密码比较
      const compareResult = bcrypt.compareSync(password, user.password)
      if (!compareResult) {
        return res.send({
          status: 1, message: '用户名或密码错误！'
        })
      }
      // 对用户的信息进行加密，生成 Token 字符串
      const tokenStr = jwt.sign({ username: username }, config.jwtSecretKey, { expiresIn: config.expiresIn })
      // 调用 res.send() 将 Token 响应给客户端
      res.send({
        status: 0,
        message: '登录成功！',
        token: 'Bearer ' + tokenStr,
        userid: user.userid,
        avatar: user.avatar,
      })
    }
    )
  }
}
//获取用户信息
exports.getUserInfo = (req, res) => {
  let { username } = req.body
  let userInfo = {}
  fs.readJson('./data/users.json', (err, obj) => {
    const getUser = (username) => obj.find(res => (res.username === username) || (res.phoneNumber === username))
    // console.log(getUser(username))
    let user = getUser(username)
    userInfo = {
      username: user.username,
      sellid: user.sellid,
      buyid: user.buyid,
      phoneNumber: user.phoneNumber,
      sellOrderNumber: user.sellOrderNumber,
      buyOrderNumber: user.buyOrderNumber,
      collect: user.collect,
      avatar: user.avatar,
      userid: user.userid
    }
    // console.log(userInfo)
    if (err) return res.send(err)
    return res.send(userInfo)
  })
}

//查找用户
exports.findUserById = (req, res) => {
  console.log(req.body)
  let { userid } = req.body
  let userInfo = {}
  fs.readJson('./data/users.json', (err, obj) => {
    const getUser = (userid) => obj.find(res => (res.userid === userid))
    // console.log(getUser(username))
    let user = getUser(userid)
    if (user == null) return res.send('用户未找到')
    userInfo = {
      username: user.username,
      avatar: user.avatar,
      userid: user.userid
    }

    // console.log(userInfo)
    if (err) return res.send(err)
    return res.send(userInfo)
  })
}

//rootLogin
exports.rootLogin = (req, res) => {
  // 接收表单数据
  let { username, password } = req.body
  // 判断数据是否合法
  if (!username || !password) {
    return res.send({ status: 1, message: '用户名/密码不能为空！' })
  } else {
    fs.readJson('./data/root.json', (err, obj) => {
      //对比['username','phongNumber']并返回对应数据
      // console.log(obj)
      const getUser = (username) => obj.find(res => (res.username === username))
      console.log(getUser(username))
      let user = getUser(username)
      if (!user) return res.send({ status: 1, message: '未找到用户' })
      //密码比较
      const compareResult = bcrypt.compareSync(password, user.password)
      if (!compareResult) {
        return res.send({
          status: 1, message: '用户名或密码错误！'
        })
      }
      // 对用户的信息进行加密，生成 Token 字符串
      const tokenStr = jwt.sign({ username: username }, config.jwtSecretKey, { expiresIn: config.expiresIn })
      // 调用 res.send() 将 Token 响应给客户端
      res.send({
        status: 0,
        message: '登录成功！',
        token: 'Bearer ' + tokenStr,
      })
    }
    )
  }
}

//收藏
exports.keep = (req, res) => {
  // console.log(req.body)
  let username = req.body.username
  let goodsId = req.body.goodsId
  let isKeep = req.body.isKeep
  if (isKeep == 'true') {
    fs.readJson('./data/users.json', (err, obj) => {
      let userindex = obj.findIndex((item) => item.username == username)
      let user = obj[userindex]
      user.collect.push(goodsId)
      //将旧数据替换
      obj.splice(userindex, 1, user)
      fs.writeJSON('./data/users.json', obj, err => {
        if (err) throw err
        console.log('add collect success')
        return res.send('add collect success')
      })
      // return res.send('收藏成功')
    })
  } else if (isKeep == 'false') {
    fs.readJson('./data/users.json', (err, obj) => {
      let userindex = obj.findIndex((item) => item.username == username)
      let user = obj[userindex]
      collectIndex = user.collect.findIndex((item) => item == goodsId)
      user.collect.splice(collectIndex, 1)
      //将旧数据替换
      obj.splice(userindex, 1, user)
      fs.writeJSON('./data/users.json', obj, err => {
        if (err) throw err
        console.log('add collect success')
        return res.send('add collect success')
      })
      // return res.send('取消收藏成功')
    })
  }



}