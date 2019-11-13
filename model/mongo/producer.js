const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  title: { type: String, trim: true, required: true },
  img: { type: String, trim: true },
  link: { type: String, trim: true },
  description: { type: String, trim: true },
  order: { type: Number, trim: true },
  parentId: { type: Schema.Types.ObjectId, trim: true },
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  altImage: { type: String, trim: true },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  isHome: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

model.index({
  title: 'text',
  createDate: 'text'
}, {
  weights: {
    title: 5,
    createDate: 1
  }
})

module.exports = mongoose.model('producer', model)
