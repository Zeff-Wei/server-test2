const express = require('express')
const goods = express.Router()

// 导入用户路由处理函数模块
const goodsHandler = require('../router_handler/goods')

//上传图片的模板
var multer = require('multer');
//生成的图片放入upload文件夹下
var picture = multer({ dest: 'data/upload' })

// 搜索商品
goods.post('/search', goodsHandler.search)
// 分类获取商品
goods.post('/classification', goodsHandler.classification)
// 添加商品
goods.post('/add', picture.single('test'), goodsHandler.add)
// 编辑商品
goods.post('/edit', picture.single('test'), goodsHandler.edit)
// 删除商品
goods.post('/delete', goodsHandler.delete)
//获取商品
goods.post('/getGoods', goodsHandler.getGoods)
//获取图片
// goods.get('/data/image',(req, res) => {
//   res.sendFile(__dirname + '/public/1.png')
// })
//取消出售
goods.post('/unSell', goodsHandler.unSell)
//删除购买订单
goods.post('/deleteOrder', goodsHandler.deleteOrder)
module.exports = goods
