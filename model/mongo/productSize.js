const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  productId: { type: String, trim: true, required: true },
  color: { type: Array },
  image: { type: Object },
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

module.exports = mongoose.model('productSize', model)
