var mysql = require('../../../../model/mysql')
var utility = require('../../../../helper/utility')
const async = require('async')

var lib = {
  insertRow: (res, form) => {
    try {
      var params = {
        code: utility.generateCode(),
        title: form.title,
        intro_title: form.intro_title,
        intro_description: (form.intro_description) ? form.intro_description : '',
        description: (form.description) ? form.description : '',
        content: form.content,
        image: form.image,
        intro_image: form.intro_image,
        img_title: (form.img_title) ? form.img_title : '',
        category_id: form.category_id,
        partner_id: form.partner_id,
        is_active: form.is_active,
        is_delete: 0,
        acc_id: form.acc_id,
        box_content: form.box_content,
        collections: form.collections,
        author: form.author,
        note: form.note
      }
      var blog = new mysql.service.blog()
      blog.setData(params)
      blog.save(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success')
          else utility.apiResponse(res, 500, 'insert fail')
        }
      })
    } catch (err) {
      utility.apiResponse(res, 500, 'server error')
    }
  },

  updateRow: (res, form) => {
    try {
      var params = {
        code: form.code,
        title: form.title,
        intro_title: form.intro_title,
        intro_description: (form.intro_description) ? form.intro_description : '',
        description: (form.description) ? form.description : '',
        content: form.content,
        image: form.image,
        intro_image: form.intro_image,
        img_title: (form.img_title) ? form.img_title : '',
        category_id: form.category_id,
        partner_id: form.partner_id,
        is_active: form.is_active,
        is_delete: form.is_delete,
        acc_id: form.acc_id,
        box_content: form.box_content,
        collections: form.collections,
        author: form.author,
        note: form.note
      }

      var blog = new mysql.service.blog()
      blog.conditionString(`code = '${params.code}'`)
      blog.whereItemTableBase((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            blog.setData(params)
            blog.update((showErr, result) => {
              if (result) utility.apiResponse(res, 200, 'success')
              else utility.apiResponse(res, 500, 'update fail')
            })
          } else {
            utility.apiResponse(res, 500, 'Category blog not found')
          }
        }
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  grid: (res, obj) => {
    try {
      var Blog = new mysql.service.blog()
      Blog.grid(obj, (err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          utility.apiResponse(res, 200, 'success', result)
        }
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  getByCode: (res, code) => {
    try {
      var blog = new mysql.service.blog()
      blog.conditionString(`code = '${code}'`)
      blog.whereItem(function (err, result) {
        if (err) utility.apiResponse(res, 500, err, null)
        else utility.apiResponse(res, 200, 'success', result)
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  update: (res, condition, params) => {
    try {
      var blog = new mysql.service.blog()
      blog.conditionFields(condition)
      blog.whereItemTableBase(function (err, result) {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) {
            blog.setData(params)
            blog.update((_err, _result) => {
              if (_err) utility.apiResponse(res, 500, _err)
              else {
                if (_result) return utility.apiResponse(res, 200, 'success', _result)
                else return utility.apiResponse(res, 500, 'update fail')
              }
            })
          } else {
            return utility.apiResponse(res, 500, 'Category not found')
          }
        }
      })
    } catch (error) { utility.apiResponse(res, 500, 'Server error', null) }
  },

  delete: (res, condition) => {
    try {
      var blog = new mysql.service.blog()
      blog.conditionFields(condition)
      blog.delete((err, result) => {
        if (err) utility.apiResponse(res, 500, 'server error')
        else {
          if (result) utility.apiResponse(res, 200, 'success', result)
          else utility.apiResponse(res, 500, 'update fail')
        }
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error', null)
    }
  },

  infoForm: (res) => {
    try {
      let getCategory = (cb) => {
        var Category = new mysql.service.category()
        Category.conditionFields({ is_active: 1, is_delete: 0 })
        Category.where((err, result) => {
          if (err) return cb(err.toString())
          else return cb(null, result)
        })
      }

      let getPartner = (cb) => {
        var Partner = new mysql.service.partner()
        Partner.conditionFields({ is_active: 1, is_delete: 0 })
        Partner.where((err, result) => {
          if (err) return cb(err.toString())
          else return cb(null, result)
        })
      }

      let getCollections = (cb) => {
        var Collection = new mysql.service.collection()
        Collection.conditionFields({ is_active: 1, is_delete: 0 })
        Collection.where((err, result) => {
          if (err) return cb(err.toString())
          else return cb(null, result)
        })
      }

      async.parallel({ categories: getCategory, partner: getPartner, collections: getCollections }, (err, resp) => {
        if (err) return utility.apiResponse(res, 500, 'server error')
        return res.status(200).json({ status: 200, message: 'success', data: resp })
      })
    } catch (error) {
      utility.apiResponse(res, 500, 'Server error')
    }
  }
}

module.exports = lib
