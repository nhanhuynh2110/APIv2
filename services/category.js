const Models = require('../model/mongo')
const {Category} = Models
module.exports.gets = (query, options, callback) => {
  Category.find(query, options, (err, categories) => {
    return callback(err, categories)
  })
}

module.exports.post = (data, callback) => {
  const category = new Category(data)
  category.save((err, category) => callback(err, category))
}
