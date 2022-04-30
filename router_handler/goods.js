/**
 * 在这里定义和商品相关的路由处理函数，供 /router/goods.js 模块进行调用
 */
const { read } = require('../function/read&write')
const fs = require('fs-extra')
const { nanoid } = require('nanoid')
const path = require('path');

//关键字搜索
exports.search = (req, res) => {
  console.log(req.body)
  // console.log(req.user)
  let keyword = req.body.keyword
  fs.readJson('./data/goods.json', (err, obj) => {
    obj = obj.filter((item) => item.title.includes(keyword) && item.status !== -1)
    // console.log(_goods)
    if (err) throw err
    return res.send(obj)

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
  let { title, price, describe, classification, seller, images } = req.body
  let id = nanoid()
  console.log(req.body)
  // let title = req.body.title
  images = images.split(',')
  let edittime = new Date().getTime()
  let newgoods = {
    title,
    price,
    describe,
    classification,
    seller,
    id,
    status: 1,
    edittime,
    images,
  }

  console.log(newgoods)
  //data写入商品
  fs.readJson('./data/goods.json', (err, obj) => {
    obj.push(newgoods)
    fs.writeJSON('./data/goods.json', obj, err => {
      if (err) throw err
    })

  })
  //商品id写入用户的数据
  fs.readJson('./data/users.json', (err, obj) => {
    let userindex = obj.findIndex((item) => item.username == seller)
    let user = obj[userindex]
    user.sellid.push(id)
    //将旧数据替换
    obj.splice(userindex, 1, user)
    fs.writeJSON('./data/users.json', obj, err => {
      if (err) throw err
      console.log('add success')
      return res.send('add success')
    })
    // return res.send('商品发布成功')
  })

}

exports.edit = (req, res) => {
  let { title, price, describe, classification, id, seller, images } = req.body
  let edittime = new Date().getTime()
  let newgoods = {
    title,
    price,
    describe,
    classification,
    id,
    seller,
    edittime,
    status: 1,
    images: []
  }
  newgoods.images = JSON.parse(images)

  /*  //读取文件路径
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
     fs.writeFile(path.join(__dirname, '../public/images/' + keepname), data, (err) => {
       if (err) {
         console.log(err)
         return res.send('写入失败')
       }
       fs.emptyDir('./data/upload', err => {
         if (err) throw err
       })
       // res.send({ err: 0, msg: '图片修改ok', })
       newgoods.images.push('http://127.0.0.1:3000/public/images/' + keepname)
       fs.readJson('./data/goods.json', (err, obj) => {
         let oldgoodsindex = obj.findIndex((item) => item.id == newgoods.id)
         let oldgoods = obj[oldgoodsindex]
         console.log(oldgoodsindex)
         console.log(oldgoods)
         console.log(oldgoods.images)
         for (let i = 0; i < oldgoods.images.length; i++) {
           fs.remove(oldgoods.images[i], err => {
             if (err) throw err
 
             console.log('delete old pic success')
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
   }) */

  fs.readJson('./data/goods.json', (err, obj) => {
    let oldgoodsindex = obj.findIndex((item) => item.id == newgoods.id)
    obj.splice(oldgoodsindex, 1, newgoods)
    fs.writeJSON('./data/goods.json', obj, err => {
      if (err) throw err
      console.log('edit success')
      return res.send('edit success')
    })
  })
}
//删除商品
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
//获取商品内容
exports.getGoods = (req, res) => {
  console.log(req.body)
  // console.log(req.user)
  let goodsId = req.body.goodsId
  fs.readJson('./data/goods.json', (err, obj) => {
    obj = obj.filter((item) => item.id == goodsId && item.status !== -1)
    // console.log(_goods)
    if (err) throw err
    return res.send(obj)

  })

}