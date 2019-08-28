const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  image: { type: String, trim: true },
  link: { type: String, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  isHome: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('gallery', model)
