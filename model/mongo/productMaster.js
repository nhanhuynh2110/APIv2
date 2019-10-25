const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({

  // info
  code: { type: String, trim: true, required: true },
  title: { type: String, trim: true, required: true },
  image: { type: String, trim: true },
  galeries: { type: Array, strim: true },
  gallery: { type: Array, trim: true },
  link: { type: String, trim: true },
  categoryId: { type: Schema.Types.ObjectId, required: true },
  categoryParentId: { type: Schema.Types.ObjectId },
  price: {type: String, trim: true, required: true},
  priceSale: {type: String, trim: true},
  description: { type: String, trim: true },
  content: { type: String, trim: true },

  // childrens
  products: {type: Array, default: []},

  // status product
  isNewProduct: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },

  // seo content
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  altImage: { type: String, trim: true },

  size: { type: String },
  unit: { type: String },

  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

model.index({
  title: 'text',
  code: 'text'
}, {
  weights: {
    title: 5,
    code: 1
  }
})

module.exports = mongoose.model('productMaster', model)
