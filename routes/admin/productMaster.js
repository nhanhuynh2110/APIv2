var utility = require('../../helper/utility')
const {ProductMasterService} = require('../../services')

module.exports = function (router) {
  router.get('/products-master', (req, res) => {
    try {
      return ProductMasterService.getProductActive().then(res.OK).catch(res.serverError)
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })

  router.get('/product-master', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      ProductMasterService.filter({
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

  router.get('/product-master/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await ProductMasterService.detail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return res.serverError(error) }
  })

  router.post('/product-master', async (req, res) => {
    try {
      const payload = req.body
      if (!payload) return res.badRequest()
      const product = await ProductMasterService.create(payload)
      if (!product) return res.serverError(new Error('Create product Unsuccessful !!!'))
      return res.OK(product)
    } catch (e) { return res.serverError(e) }
  })

  router.put('/product-master/:id', async (req, res) => {
    try {
      const payload = req.body
      const {id} = req.params
      if (!payload || !id) return res.badRequest()
      const product = await ProductMasterService.updateById(id, payload)
      if (!product) return res.notFound()
      return res.OK(product)
    } catch (err) { return res.serverError(err) }
  })

  router.delete('/product-master/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const product = await ProductMasterService.deleteById(id)
      if (!product) return res.notFound()
      else res.OK(true)
    } catch (error) { return res.serverError(error) }
  })
}
