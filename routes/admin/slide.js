const async = require('async')
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')

const authUser = require('../../controller/authenticate/autuser')
const utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const {Slide} = Models

module.exports = function (router) {

  router.get('/slides', authUser.checkTokenAdmin, (req, res) => {
    try {
      Slide.find({ isActive: true, isDelete: false }, (err, galeries) => {
        if (err) return utility.apiResponse(res, 500, err.toString(), null)
        return utility.apiResponse(res, 200, 'success', galeries)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/slide', authUser.checkTokenAdmin, (req, res) => {
    try {
      const {strKey, isDelete, pageSize, pageNumber, colSort, typeSort} = req.query
      const query = {}
      const sort = colSort && typeSort ? { [colSort]: typeSort === 'asc' ? 1 : -1 } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        Slide.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        Slide.find(query, (err, categories) => cb(err, categories)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        console.log('data', data)
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/slide/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      let {id} = req.params
      Slide.findOne({_id: ObjectId(id)}, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/slide', (req, res) => {
    try {
      let data = req.body
      data['isDelete'] = false
      let slide = new Slide(data)
      var error = slide.validateSync()

      if (error) {
        var errorKeys = Object.keys(error.errors)
        return utility.apiResponse(res, 500, error.errors[errorKeys[0].message].toString())
      }

      slide.save((err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      console.error(e)
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/slide/:id', (req, res) => {
    try {
      let field = req.body
      delete field.id
      Slide.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, {new: true}, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/slide/:id', authUser.checkTokenAdmin, (req, res) => {
    try {
      var { id } = req.params
      const slide = (cb) => {
        Slide.findOne({_id: id}, (err, data) => {
          return cb(err, data)
        })
      }
      const removeFile = (Slide, cb) => {
        const dir = `${global.rootDirectory}/uploads${Slide.image}`
        fs.unlink(dir, (err) => {
          if (err) return cb(err)
          return cb(null)
        })
      }
      async.waterfall([slide, removeFile], (error) => {
        if (error) return utility.apiResponse(res, 500, error.toString(), null)
        Slide.deleteOne({_id: ObjectId(id)}, (err) => {
          if (err) return utility.apiResponse(res, 500, err.toString())
          return utility.apiResponse(res, 200, 'success', true)
        })
      })
    } catch (error) {
      return utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}
