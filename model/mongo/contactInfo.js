const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true },
  fax: { type: String, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  fb: { type: String, trim: true },
  twitter: { type: String, trim: true },
  google: { type: String, trim: true },
  youtube: { type: String, trim: true },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

model.index({
  title: 'name',
  createDate: 'text'
}, {
  weights: {
    title: 5,
    createDate: 1
  }
})

module.exports = mongoose.model('contactInfo', model)
