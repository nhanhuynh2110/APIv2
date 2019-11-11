const _ = require('lodash')
const utility = require('../../helper/utility')
const ObjectId = require('mongoose').Types.ObjectId
const {
  Product,
  Post,
  Category,
  CategoryPost,
  Contact,
  ContactInfo,
  Gallery} = require('../../model/mongo')

module.exports = {
  common: () => {
    const category = () => Category.find({ isActive: true, isDelete: false })
      .then(all => ({ all, parent: all.filter(el => !el.parentId) }))

    const categoryPosts = () => CategoryPost.find({ isActive: true, isDelete: false })
      .then(catePosts => ({ all: catePosts, parent: catePosts.filter(el => !el.parentId) }))

    const proNew = () => Product.find({ isActive: true, isDelete: false, isNewProduct: true }).populate('categoryId')
    const proHot = () => Product.find({ isActive: true, isDelete: false, isHot: true }).populate('categoryId')
    const galleries = () => Gallery.find({isActive: true, isDelete: false})
    const contactInfo = () => ContactInfo.findOne({ isActive: true })

    return utility.runParrallel([category, categoryPosts, proNew, proHot, galleries, contactInfo]).then(data => {
      const parallel = []
      const categoriesHome = data[0].all.filter(el => el.isHome)
      categoriesHome.forEach(cat => {
        parallel.push(() => {
          return Product.find({categoryParentId: cat._id, isActive: true, isDelete: false}).populate('categoryId').limit(4)
            .then(products => {
              return {
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
                products: products
              }
            })
        })
      })

      return utility.runParrallel(parallel).then(dt => {
        return {
          category: data[0],
          categoryPost: data[1],
          productNew: data[2],
          productHot: data[3],
          galleries: data[4],
          contactInfo: data[5],
          categoryHome: dt
        }
      })
    })
  },
  productList: async (categoryId, page, pageSize) => {
    const category = await Category.findOne({ _id: ObjectId(categoryId) })
    const skip = parseInt(pageSize) * (parseInt(page) - 1)
    if (!category) return Promise.resolve(null)
    const products = () => Product.find({ isActive: true, isDelete: false, categoryId: ObjectId(categoryId) }).populate('categoryId').skip(skip).limit(parseInt(pageSize))
    const count = () => Product.count({ isActive: true, isDelete: false, categoryId: ObjectId(categoryId) })
    return utility.runParrallel([products, count]).then(data => {
      return {
        products: data[0],
        total: data[1]
      }
    })
  },

  productDetail: async (categoryId, productId) => {
    const category = await Category.findOne({ _id: ObjectId(categoryId) })
    if (!category) return Promise.resolve(null)
    return Product.findOne({ _id: ObjectId(productId), isActive: true, isDelete: false, categoryId: ObjectId(categoryId) }).populate('categoryId')
  },

  blogList: async (categoryBlogId, page, pageSize) => {
    const categoryPost = await CategoryPost.findOne({ _id: ObjectId(categoryBlogId) })
    const skip = parseInt(pageSize) * (parseInt(page) - 1)
    if (!categoryPost) return Promise.resolve(null)
    const posts = () => Post.find({ isActive: true, isDelete: false, categoryPostId: ObjectId(categoryBlogId) }).populate('categoryPostId').skip(skip).limit(parseInt(pageSize))
    const count = () => Post.count({ isActive: true, isDelete: false, categoryPostId: ObjectId(categoryBlogId) })
    return utility.runParrallel([posts, count]).then(data => {
      return {
        posts: data[0],
        total: data[1]
      }
    })
  },

  postDetail: async (categoryPostId, postId) => {
    const categoryPost = await CategoryPost.findOne({ _id: ObjectId(categoryPostId) })
    if (!categoryPost) return Promise.resolve(null)
    return Post.findOne({ _id: ObjectId(postId), isActive: true, isDelete: false, categoryPostId: ObjectId(categoryPostId) }).populate('categoryPostId')
  },

  contact: ({ name, subject, email, message, phone }) => {
    const contact = new Contact({ name, subject, email, message, phone })
    return contact.save()
  }
}
