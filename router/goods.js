const express = require('express')
const goods = express.Router()

// 导入用户路由处理函数模块
const goodsHandler = require('../router_handler/goods')

//上传图片的模板
var multer = require('multer');
//生成的图片放入image文件夹下
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

module.exports = goods
