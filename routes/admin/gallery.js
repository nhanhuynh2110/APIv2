const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')

const authUser = require('../../controller/authenticate/autuser')
const utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {Gallery} = Models

module.exports = function (router) {

  router.get('/galleries', authUser.checkTokenAdmin, (req, res) => {
    try {
      Gallery.find({ isActive: true, isDelete: false }, (err, galeries) => {
        if (err) return utility.apiResponse(res, 500, err.toString(), null)
        return utility.apiResponse(res, 200, 'success', galeries)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/gallery', authUser.checkTokenAdmin, (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        Gallery.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        Gallery.find(query, (err, categories) => cb(err, categories)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/gallery/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      let {id} = req.params
      Gallery.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/gallery', authUser.checkTokenAdmin, (req, res) => {
    try {
      let {data} = req.body
      if (!data || data.length <= 0) return utility.apiResponse(res, 500, 'Data is not empty')
      Gallery.insertMany(data, (error, docs) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', docs)
      })
    } catch (e) {
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/gallery/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      let field = req.body
      delete field.id
      Gallery.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/gallery/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { id } = req.params
      const gallery = (cb) => {
        Gallery.findOne({_id: id}, (err, data) => {
          return cb(err, data)
        })
      }
      const removeFile = (gallery, cb) => {
        const dir = `${global.rootDirectory}/uploads${gallery.image}`
        fs.unlink(dir, (err) => {
          if (err) return cb(err)
          return cb(null)
        })
      }
      async.waterfall([gallery, removeFile], (error) => {
        if (error) return utility.apiResponse(res, 500, error.toString(), null)
        Gallery.deleteOne({_id: ObjectId(id)}, (err) => {
          if (err) return utility.apiResponse(res, 500, err.toString())
          return utility.apiResponse(res, 200, 'success', true)
        })
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}
