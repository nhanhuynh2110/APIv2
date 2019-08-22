let Blog = require('./blog')

module.exports = () => {
  return {
    blog: new Blog()
  }
}
