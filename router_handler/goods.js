/**
 * 在这里定义和商品相关的路由处理函数，供 /router/goods.js 模块进行调用
 */
const { read } = require('../function/read&write')
const fs = require('fs-extra')
const { nanoid } = require('nanoid')
const path = require('path');


exports.search = (req, res) => {
  // console.log(req.body)
  // console.log(req.user)
  let keyword = req.body.keyword
  fs.readJson('./data/goods.json', (err, obj) => {
    try {
      obj = obj.filter((item) => item.title.includes(keyword) && item.status !== -1)
      // console.log(_goods)
      return res.send(obj)
    } catch (e) {
      console.error(e)
    }
  })

}

exports.classification = (req, res) => {
  let classification = req.body.classification
  fs.readJson('./data/goods.json', (err, obj) => {
    try {
      obj = obj.filter((item) => item.classification.includes(classification) && item.status !== -1)
      return res.send(obj)
    } catch (e) {
      console.error(e)
    }
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

  //读取文件路径
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
      // res.send({ err: 0, msg: '图片上传ok', })

      newgoods.image.push('./data/image/' + keepname)
      let _goods = []
      fs.readJson('./data/goods.json', (err, obj) => {
        _goods = obj
        obj.push(newgoods)
        fs.writeJSON('./data/goods.json', obj, err => {
          if (err) throw err
          console.log('add success')
          return res.send('add success')
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

  //读取文件路径
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
      })
      // res.send({ err: 0, msg: '图片修改ok', })
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
        obj.splice(oldgoodsindex, 1, newgoods)
        fs.writeJSON('./data/goods.json', obj, err => {
          if (err) throw err
          console.log('edit success')
          return res.send('edit success')
        })
      })
    });
  })
}

exports.delete = (req, res) => {
  let oldgoodsid = req.body.id
  fs.readJson('./data/goods.json', (err, obj) => {
    let oldgoodsindex = obj.findIndex((item) => item.id == oldgoodsid)
    obj.splice(oldgoodsindex, 1)
    fs.writeJSON('./data/goods.json', obj, err => {
      if (err) throw err
      console.log('delete success')
      return res.send('delete success')
    })
  })
}