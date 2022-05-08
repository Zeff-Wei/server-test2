const express = require('express');
const upload = express.Router();
const fs = require('fs-extra');
const path = require('path');
// const serverUrl = 'http://127.0.0.1:3000';
const serverUrl = 'http://www.wulies.xyz:3001';
//上传图片的模板
var multer = require('multer');
//生成的图片放入images文件夹下
var picture = multer({ dest: 'data/upload' })
//图片上传必须用post方法
upload.post('/upload', picture.single('test'), (req, res) => {
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
    fs.writeFile(path.join(__dirname, '../public/images/' + keepname), data, (err) => {
      if (err) {
        // console.log(err)
        return res.send('写入失败')
      }
      fs.emptyDir('./data/upload', err => {
        if (err) throw err
        // console.log('success', err)
      })
      let picLocation = serverUrl + '/public/images/' + keepname
      res.send({ err: 0, msg: '上传ok', picLocation: picLocation })
    });
  });
})
module.exports = upload;