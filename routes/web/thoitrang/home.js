const async = require('async')
const _ = require('lodash')

const utility = require('../../../helper/utility')
const Models = require('../../../model/mongo')

const { Category, Product, Gallery, Slide } = Models

module.exports = (router) => {
  router.get('/menu', (req, res) => {
    try {
      const menu = (cb) => {
        Category.find({ isActive: true, isDelete: false }, (err, categories) => {
          return cb(err, categories)
        })
      }

      async.parallel({ menu }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        return utility.apiResponse(res, 200, 'Success', data)
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
  router.get('/homepage', (req, res) => {
    try {
      const categories = (cb) => {
        Category.find({ isActive: true, isDelete: false }, (err, categories) => {
          return cb(err, categories)
        })
      }

      const productsNew = (cb) => {
        Product.find({ isActive: true, isDelete: false, isNewProduct: true }, (err, posts) => {
          return cb(err, posts)
        }).limit(12)
      }

      const productsHot = (cb) => {
        Product.find({ isActive: true, isDelete: false, isHot: true }, (err, posts) => {
          return cb(err, posts)
        }).limit(12)
      }

      const slides = (cb) => {
        Slide.find({ isActive: true, isDelete: false }, cb)
      }

      const galleries = (cb) => {
        Gallery.find({ isActive: true, isDelete: false }, (err, galleries) => {
          return cb(err, galleries)
        }).sort({createDate: -1}).limit(21)
      }

      async.parallel({ categories, productsNew, productsHot, slides, galleries }, (error, data) => {
        if (error) return utility.apiResponse(res, 500, error.toString())
        const categories = data.categories
        const categoriesHome = categories.filter(el => el.isHome)
        let parallel = []
        categoriesHome.forEach(cat => {
          parallel.push((callback) => {
            Product.find({categoryParentId: cat._id, isActive: true, isDelete: false}, (e, dt) => {
              if (e) return callback(e)
              const catDt = {
                _id: cat._id,
                title: cat.title,
                img: cat.img,
                link: cat.link,
                description: cat.description,
                order: cat.order,
                parentId: cat.parentId,
                isDelete: cat.isDelete,
                isHome: cat.isHome,
                activeDate: cat.activeDate,
                createDate: cat.createDate,
                updateDate: cat.updateDate,
                products: dt
              }
              return callback(null, catDt)
            }).limit(4)
          })
        })

        async.parallel(parallel, (err, resp) => {
          if (err) return utility.apiResponse(res, 500, error.toString())
          data['categoryHomeWithProduct'] = resp
          return utility.apiResponse(res, 200, 'Success', data)
        })
      })
    } catch (error) { return utility.apiResponse(res, 500, error.toString()) }
  })
}
