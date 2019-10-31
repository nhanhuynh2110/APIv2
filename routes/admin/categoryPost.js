// const router = require('express').Router()
var utility = require('../../helper/utility')

const {CategoryPostService} = require('../../services')

module.exports = function (router) {
  router.get('/category-post/parent', (req, res) => {
    try {
      return CategoryPostService.getParents().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })

  router.get('/category-posts', (req, res) => {
    try {
      return CategoryPostService.getCategoryPostActive().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })
  router.get('/category-post', (req, res) => {
    try {
      const {strKey, level, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      return CategoryPostService.filter({
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

  router.get('/category-post/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await CategoryPostService.detail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/category-post', async (req, res) => {
    try {
      const payload = req.body
      if (!payload) return res.badRequest()
      const categoryPost = await CategoryPostService.create(payload)
      if (!categoryPost) return res.serverError(new Error('Method create categoryPost Unsuccessful !!!'))
      return res.OK(categoryPost)
    } catch (error) {
      return res.serverError(error.toString())
    }
  })

  router.put('/category-post/:id', async (req, res) => {
    try {
      const payload = req.body
      const {id} = req.params
      if (!payload || !id) return res.badRequest()
      const categoryPost = await CategoryPostService.updateById(id, payload)
      if (!categoryPost) return res.notFound()
      return res.OK(categoryPost)
    } catch (error) { res.serverError(error.toString()) }
  })

  router.put('/category-post/:id/order/:number', (req, res) => {
    try {
      const {id, number} = req.params

      if (typeof parseInt(number) !== 'number') return res.badRequest('number invalid !!!')

      return CategoryPostService.updateOrderNumber(id, number).then((resp) => res.OK(true)).catch(res.serverError)
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/category-post/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const categoryPost = await CategoryPostService.deleteById(id)
      if (!categoryPost) return res.notFound()
      else res.OK(true)
    } catch (error) { res.serverError(error.toString()) }
  })
}
