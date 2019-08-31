var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId

var utility = require('../../helper/utility')
const Models = require('../../model/mongo')
const { Post } = Models

module.exports = function (router) {
  router.get('/post', (req, res) => {
    try {
      const { strKey, isDelete, pageSize, pageNumber, colSort, typeSort } = req.query
      const query = {}
      const sort = colSort && typeSort ? {
        [colSort]: typeSort === 'asc' ? 1 : -1
      } : null
      if (strKey) { query['$text'] = { $search: strKey } }
      query['isDelete'] = isDelete === 'true'
      const total = (cb) => {
        Post.count(query, (err, data) => cb(err, data))
      }

      const list = (cb) => {
        let skip = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        let limit = parseInt(pageSize)
        Post.find(query, (err, dt) => cb(err, dt)).skip(skip).limit(limit).sort(sort)
      }

      async.parallel({ total, list }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { utility.apiResponse(res, 500, error.toString(), null) }
  })

  router.get('/post/:id', (req, res) => {
    try {
      let { id } = req.params
      Post.findOne({ _id: ObjectId(id) }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error, null) }
  })

  router.post('/post', (req, res) => {
    try {
      let data = req.body
      data['isDelete'] = false
      let post = new Post(data)
      var error = post.validateSync()

      if (error) {
        var errorKeys = Object.keys(error.errors)
        return utility.apiResponse(res, 500, error.errors[errorKeys[0].message].toString())
      }

      post.save((err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (e) {
      console.log(e)
      return utility.apiResponse(res, 500, 'server error')
    }
  })

  router.put('/post/:id', (req, res) => {
    try {
      let field = req.body
      delete field.id
      Post.findOneAndUpdate({ _id: ObjectId(req.params.id) }, field, { new: true }, (err, data) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', data)
      })
    } catch (err) {
      return utility.apiResponse(res, 500, err, null)
    }
  })

  router.delete('/post/:id', (req, res) => {
    try {
      var { id } = req.params
      Post.deleteOne({ _id: ObjectId(id) }, (err) => {
        if (err) return utility.apiResponse(res, 500, err.toString())
        return utility.apiResponse(res, 200, 'success', true)
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  })
}
