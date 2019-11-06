var utility = require('../../helper/utility')
const {PostService} = require('../../services')

module.exports = function (router) {
  router.get('/posts', (req, res) => {
    try {
      return PostService.getProductActive().then(res.OK).catch(res.serverError)
    } catch (error) { utility.apiResponse(res, 500, error.toString()) }
  })

  router.get('/post', (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      PostService.filter({
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

  router.get('/post/:id', async (req, res) => {
    try {
      let {id} = req.params
      if (!id) return res.badRequest('request invalid')
      const data = await PostService.detail(id)
      if (!data) return res.notFound()
      return res.OK(data)
    } catch (error) { return res.serverError(error) }
  })

  router.post('/post', async (req, res) => {
    try {
      const payload = req.body
      if (!payload) return res.badRequest()
      const post = await PostService.create(payload)
      if (!post) return res.serverError(new Error('Create post Unsuccessful !!!'))
      return res.OK(post)
    } catch (e) { return res.serverError(e) }
  })

  router.put('/post/:id', async (req, res) => {
    try {
      const payload = req.body
      const {id} = req.params
      if (!payload || !id) return res.badRequest()
      const post = await PostService.updateById(id, payload)
      if (!post) return res.notFound()
      return res.OK(post)
    } catch (err) { return res.serverError(err) }
  })

  router.delete('/post/:id', async (req, res) => {
    try {
      var { id } = req.params
      if (!id) return res.badRequest()
      const post = await PostService.deleteById(id)
      if (!post) return res.notFound()
      else res.OK(true)
    } catch (error) { return res.serverError(error) }
  })
}