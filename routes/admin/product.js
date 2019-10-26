var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId

var utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {ProductService} = require('../../services')
const {Product, Category, ProductSize} = Models

module.exports = function (router) {
  router.get('/products', (req, res) => {
    try {
      Product.find({ isActive: true, isDelete: false }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/product', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query

      ProductService.filter({
        $searchKey: strKey,
        isDelete: isDelete,
        pageSize: pageSize,
        pageNumber: pageNumber,
        colSort: colSort,
        typeSort: typeSort
      })
        .then(res.OK)
        .catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.get('/product/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await ProductService.productDetail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return res.serverError(error) }
  })

  router.post('/product', async (req, res) => {
    try {
      const payload = req.body
      if (!payload) return res.badRequest()
      const product = await ProductService.create(payload)
      if (!product) return res.serverError(new Error('Create product Unsuccessful !!!'))
      return res.OK(product)
    } catch (e) { return res.serverError(e) }
  })

  router.put('/product/:id', async (req, res) => {
    try {
      const payload = req.body
      const {id} = req.params
      if (!payload || !id) return res.badRequest()
      const product = await ProductService.updateById(id, payload)
      if (!product) return res.notFound()
      return res.OK(product)
    } catch (err) { return res.serverError(err) }
  })

  router.delete('/product/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const product = await ProductService.deleteById(id)
      if (!product) return res.notFound()
      else res.OK(true)
    } catch (error) { return res.serverError(error) }
  })
}
