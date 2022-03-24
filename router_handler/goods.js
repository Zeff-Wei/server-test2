/**
 * 在这里定义和商品相关的路由处理函数，供 /router/goods.js 模块进行调用
 */
const { read } = require('../function/read&write')
const fs = require('fs-extra')
const { nanoid } = require('nanoid')
const path = require('path');


exports.search = (req, res) => {
  // console.log(req.body)
  let _goods = []
  let keyword = req.body.keyword
  fs.readJson('./data/goods.json', (err, obj) => {
    _goods = obj
    // console.log(_goods)
    _goods = _goods.filter((item) => item.title.includes(keyword) && item.status !== -1)
    // console.log(_goods)
    return res.send(_goods)
  })
}

exports.classification = (req, res) => {
  // console.log(req.body)
  let _goods = []
  let classification = req.body.classification
  fs.readJson('./data/goods.json', (err, obj) => {
    _goods = obj
    // console.log(_goods)
    _goods = _goods.filter((item) => item.classification.includes(classification) && item.status !== -1)
    // console.log(_goods)
    return res.send(_goods)
  })
}

exports.add = (req, res) => {
  let { title, price, describe, classification } = req.body
  let id = nanoid()
  let edittime = new Date().getTime()
  let newgoods = {
    title,
    price,
    describe,
    classification,
    id,
    status: 1,
    edittime,
    image: []
  }
  // console.log(newgoods)


  //读取文件路径
  // console.log(req.file)
  // console.log(req.body)
  fs.readFile(req.file.path, (err, data) => {
    //如果读取失败
    if (err) { return res.send('上传失败') }
    //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
    let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
    //拓展名
    let extname = req.file.mimetype.split('/')[1]
    //拼接成图片名

    let keepname = time + '.' + extname
    // console.log(keepname)


    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    fs.writeFile(path.join(__dirname, '../data/image/' + keepname), data, (err) => {
      if (err) {
        console.log(err)
        return res.send('写入失败')
      }
      fs.emptyDir('./data/upload', err => {
        if (err) throw err
        // console.log('success', err)
      })
      res.send({ err: 0, msg: '图片上传ok', })

      newgoods.image.push('./data/image/' + keepname)
      let _goods = []
      fs.readJson('./data/goods.json', (err, obj) => {
        _goods = obj
        // console.log(_goods)
        // console.log(newgoods)
        obj.push(newgoods)
        fs.writeJSON('./data/goods.json', obj, err => {
          if (err) throw err
          console.log('add success')
        })

      })

    });

  })

}

exports.edit = (req, res) => {
  let { title, price, describe, classification, id } = req.body
  let edittime = new Date().getTime()
  let newgoods = {
    title,
    price,
    describe,
    classification,
    id,
    edittime,
    status: 1,
    image: []
  }
  // console.log(newgoods)


  //读取文件路径
  // console.log(req.file)
  // console.log(req.body)
  fs.readFile(req.file.path, (err, data) => {
    //如果读取失败
    if (err) { return res.send('上传失败') }
    //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
    let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
    //拓展名
    let extname = req.file.mimetype.split('/')[1]
    //拼接成图片名

    let keepname = time + '.' + extname
    // console.log(keepname)


    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    fs.writeFile(path.join(__dirname, '../data/image/' + keepname), data, (err) => {
      if (err) {
        console.log(err)
        return res.send('写入失败')
      }
      fs.emptyDir('./data/upload', err => {
        if (err) throw err
        // console.log('success', err)
      })
      res.send({ err: 0, msg: '图片修改ok', })

      newgoods.image.push('./data/image/' + keepname)

      fs.readJson('./data/goods.json', (err, obj) => {

        let oldgoodsindex = obj.findIndex((item) => item.id == newgoods.id)
        let oldgoods = obj[oldgoodsindex]
        console.log(oldgoodsindex)
        console.log(oldgoods)
        console.log(oldgoods.image)

        for (let i = 0; i < oldgoods.image.length; i++) {
          fs.remove(oldgoods.image[i], err => {
            if (err) throw err

            console.log('delete old picsuccess')
          })
        }
        // console.log(_goods)
        // console.log(newgoods)
        obj.splice(oldgoodsindex, 1, newgoods)
        fs.writeJSON('./data/goods.json', obj, err => {
          if (err) throw err
          console.log('edit success')
        })

      })

    });

  })

}
exports.delete = (req, res) => { }