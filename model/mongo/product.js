const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  code: { type: String, trim: true, required: true },
  title: { type: String, trim: true, required: true },
  image: { type: String, trim: true },
  gallery: { type: Array, trim: true },
  link: { type: String, trim: true },
  categoryId: { type: Schema.Types.ObjectId, required: true },
  categoryParentId: { type: Schema.Types.ObjectId },
  price: {type: String, trim: true, required: true},
  priceSale: {type: String, trim: true},
  description: { type: String, trim: true },
  content: { type: String, trim: true },
  isNewProduct: { type: Boolean, default: false },
  isHot: {type: Boolean, default: false },

  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  altImage: { type: String, trim: true },

  isHot: { type: Boolean, default: false },
  size: { type: Array },
  color: { type: Array },
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

module.exports = mongoose.model('product', model)
