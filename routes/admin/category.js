// const router = require('express').Router()
var utility = require('../../helper/utility')

const {CategoryService} = require('../../services')

module.exports = function (router) {
  router.get('/category/parent', (req, res) => {
    try {
      return CategoryService.getParents().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })

  router.get('/categories', (req, res) => {
    try {
      return CategoryService.getCategoryActive().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })
  router.get('/category', (req, res) => {
    try {
      const {strKey, level, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      return CategoryService.filter({
        $searchKey: strKey,
        isDelete: isDelete,
        pageSize: pageSize,
        pageNumber: pageNumber,
        colSort: colSort,
        typeSort: typeSort,
        level: level
      }).then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.get('/category/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await CategoryService.detail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/category', async (req, res) => {
    try {
      const payload = req.body
      if (!payload) return res.badRequest()
      const category = await CategoryService.create(payload)
      if (!category) return res.serverError(new Error('Method create category Unsuccessful !!!'))
      return res.OK(category)
    } catch (error) {
      return res.serverError(error.toString())
    }
  })

  router.put('/category/:id', async (req, res) => {
    try {
      const payload = req.body
      const {id} = req.params
      if (!payload || !id) return res.badRequest()
      const category = await CategoryService.updateById(id, payload)
      if (!category) return res.notFound()
      return res.OK(category)
    } catch (error) { res.serverError(error.toString()) }
  })

  router.put('/category/:id/order/:number', (req, res) => {
    try {
      const {id, number} = req.params

      if (typeof parseInt(number) !== 'number') return res.badRequest('number invalid !!!')

      return CategoryService.updateOrderNumber(id, number).then((resp) => res.OK(true)).catch(res.serverError)
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/category/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const category = await CategoryService.deleteById(id)
      if (!category) return res.notFound()
      else res.OK(true)
    } catch (error) { res.serverError(error.toString()) }
  })
}
