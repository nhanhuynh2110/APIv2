const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true },
  subject: { type: String, trim: true },
  message: { type: String, trim: true },
  phone: { type: String, trim: true },
  contactInfo: { type: String, trim: true },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

model.index({
  title: 'subject',
  createDate: 'text'
}, {
  weights: {
    title: 5,
    createDate: 1
  }
})

module.exports = mongoose.model('contact', model)
