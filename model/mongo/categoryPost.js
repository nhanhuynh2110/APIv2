const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  title: { type: String, trim: true, required: true },
  logo: { type: String, trim: true },
  link: { type: String, trim: true },
  fate: { type: Number, default: 0 },
  description: { type: String },
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

module.exports = mongoose.model('categoryPost', model)
