const _ = require('lodash')
const {ContactInfoService} = require('../../services')

module.exports = (router) => {
  router.get('/contact-info', (req, res) => {
    try {
      ContactInfoService.detail()
        .then(res.OK)
        .catch(res.serverError)
    } catch (error) { return res.serverError(error) }
  })
  router.put('/contact-info', async (req, res) => {
    try {
      const payload = req.body
      const contactInfo = await ContactInfoService.detail()
      if (!contactInfo) {
        return ContactInfoService.insert(payload).then(res.OK).catch(res.serverError)
      }
      return ContactInfoService.updateById(payload, contactInfo._id).then(res.OK).catch(res.serverError)
    } catch (error) {
      return res.serverError(error)
    }
  })
}