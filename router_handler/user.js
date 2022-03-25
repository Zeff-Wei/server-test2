/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const fs = require('fs-extra')
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 判断数据是否合法
  let username = userinfo.username
  let password = userinfo.password
  if (!username || !password) {
    return res.send({ status: 1, message: '用户名或密码不能为空！' })
  } else {
    fs.readJson('./data/users.json', (err, obj) => {
      //对比分类ID并返回对应数据
      const getElement = (username) => obj.find(res => res.username === username);
      if (getElement(username)) { return res.send({ status: 1, message: '用户名已被占用' }) }
      else {
        password = bcrypt.hashSync(password, 10)
        obj.push({ "username": username, "password": password, "sellid": [], "buyid": [] })
        fs.writeJSON('./data/users.json', obj, err => {
          if (err) throw err
          // console.log('success')
        })

        return res.send({ status: 0, message: 'reguser OK' })
      }


    })
  }
}

// 登录的处理函数
exports.login = (req, res) => {
  const userinfo = req.body
  // console.log(userinfo)
  let username = userinfo.username
  let password = userinfo.password
  // console.log(username, password)
  fs.readJson('./data/users.json', (err, obj) => {
    //对比分类ID并返回对应数据
    // console.log(obj)
    const getuser = (username) => obj.find(res => res.username === username)
    // console.log(getElement(username))
    let user = getuser(username)
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
