const mongoose = require('mongoose')

const { Schema } = mongoose

const model = new Schema({
  title: { type: String, trim: true, required: true },
  introTitle: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  content: { type: String, trim: true },
  introImage: { type: String, trim: true },
  image: { type: String, trim: true },
  categoryPostId: { type: Schema.Types.ObjectId, required: true },
  isActive: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  activeDate: { type: Date, default: Date.now() },
  createDate: { type: Date, default: Date.now() },
  updateDate: { type: Date, default: Date.now() }
})

model.index({
  title: 'text',
  introTitle: 'text'
}, {
  weights: {
    title: 5,
    introTitle: 1
  }
})

module.exports = mongoose.model('post', model)
