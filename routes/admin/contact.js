// const router = require('express').Router()
var utility = require('../../helper/utility')

const {ContactService} = require('../../services')

module.exports = function (router) {
  router.get('/contacts', (req, res) => {
    try {
      return ContactService.getContactActive().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error.toString()) }
  })
  router.get('/contact', (req, res) => {
    try {
      const {strKey, level, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      return ContactService.filter({
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

  router.get('/contact/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await ContactService.detail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.delete('/contact/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const contact = await ContactService.deleteById(id)
      if (!contact) return res.notFound()
      else res.OK(true)
    } catch (error) { res.serverError(error.toString()) }
  })
}
