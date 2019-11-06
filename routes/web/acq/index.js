
module.exports = (router) => {
  require('./home')(router)
  require('./list')(router)
  require('./detail')(router)
  require('./listBlog')(router)
  require('./detailBlog')(router)
}
