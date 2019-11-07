const {Website} = require('../../../services')
module.exports = (router) => {
  router.get('/all', (req, res) => {
    try {
      return Website.common().then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.get('/category/:catId/products', (req, res) => {
    try {
      const {catId} = req.params
      const {page = 1, pageSize = 10} = req.query
      if (!catId) return res.notFound()
      return Website.productList(catId, page, pageSize).then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.get('/category/:catId/product/:productId', (req, res) => {
    try {
      const {catId, productId} = req.params
      if (!catId || !productId) return res.notFound()
      return Website.productDetail(catId, productId).then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.get('/category-post/:catPostId/posts', (req, res) => {
    try {
      const {catPostId} = req.params
      const {page = 1, pageSize = 10} = req.query
      if (!catPostId) return res.notFound()
      return Website.blogList(catPostId, page, pageSize).then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.get('/category-post/:catPostId/post/:postId', (req, res) => {
    try {
      const {catPostId, postId} = req.params
      if (!catPostId || !postId) return res.notFound()
      return Website.postDetail(catPostId, postId).then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })

  router.post('/contact', (req, res) => {
    try {
      return Website.contact(req.body).then(res.OK).catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })
}
