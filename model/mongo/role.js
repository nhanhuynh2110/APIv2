const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  title: { type: String, trim: true, required: true },
  permissions: { type: Array },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

model.index({
  title: 'text'
}, {
  weights: {
    title: 5
  }
})

module.exports = mongoose.model('role', model)
