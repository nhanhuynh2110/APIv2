// const router = require('express').Router()
var utility = require('../../helper/utility')

const {ProducerService} = require('../../services')

module.exports = function (router) {
  router.get('/producer/parent', (req, res) => {
    try {
      return ProducerService.getParents().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })

  router.get('/producers', (req, res) => {
    try {
      return ProducerService.getProducerActive().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })
  router.get('/producer', (req, res) => {
    try {
      const {strKey, level, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      return ProducerService.filter({
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

  router.get('/producer/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await ProducerService.detail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/producer', async (req, res) => {
    try {
      const payload = req.body
      if (!payload) return res.badRequest()
      const producer = await ProducerService.create(payload)
      if (!producer) return res.serverError(new Error('Method create producer Unsuccessful !!!'))
      return res.OK(producer)
    } catch (error) {
      return res.serverError(error.toString())
    }
  })

  router.put('/producer/:id', async (req, res) => {
    try {
      const payload = req.body
      const {id} = req.params
      if (!payload || !id) return res.badRequest()
      const producer = await ProducerService.updateById(id, payload)
      if (!producer) return res.notFound()
      return res.OK(producer)
    } catch (error) { res.serverError(error.toString()) }
  })

  router.put('/producer/:id/order/:number', (req, res) => {
    try {
      const {id, number} = req.params

      if (typeof parseInt(number) !== 'number') return res.badRequest('number invalid !!!')

      return ProducerService.updateOrderNumber(id, number).then((resp) => res.OK(true)).catch(res.serverError)
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/producer/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const producer = await ProducerService.deleteById(id)
      if (!producer) return res.notFound()
      else res.OK(true)
    } catch (error) { res.serverError(error.toString()) }
  })
}
