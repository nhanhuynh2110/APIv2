const mongoose = require('mongoose')

const {Schema} = mongoose

const model = new Schema({
  username: {type: String, require: true, uppercase: false},
  email: {type: String, require: true, uppercase: false},
  password: {type: String, require: true, uppercase: false},
  firstname: {type: String, require: true},
  lastname: {type: String, require: true},
  birthdate: { type: Date },
  address: { type: String },
  phone: { phone: String },
  gender: { type: Number },
  identityCard: { type: String },
  roleId: { type: Schema.Types.ObjectId },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('user', model)
