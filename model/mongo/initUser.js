const sha256 = require('sha256')
const async = require('async')

const {createUser} = require('../../config/config')
const Models = require('./index')

module.exports = () => {
  if (createUser) {
    const role = (cb) => {
      Models.Role.findOne({ title: 'Master' }, (err, r) => {
        if (err) return cb(err)
        if (r) return cb(null, r)
        const role1 = new Models.Role({
          title: 'Master',
          permissions: ['CATEGORYVIEW', 'POSTVIEW', 'ACCOUNTVIEW', 'GALLERYEDIT'],
          isActive: true
        })

        role1.save((err, myrole) => {
          return cb(err, myrole)
        })
      })
    }

    const user = (role, cb) => {
      Models.User.findOne({ username: 'master' }, (r, myUser) => {
        if (myUser) return cb(null, myUser)
        const userSave = new Models.User({
          username: 'master',
          email: 'phumanong@gmail.com',
          password: sha256('nhanhuynh'),
          firstname: 'phu',
          lastname: 'huynh',
          birthdate: new Date(),
          address: 'duong so 1 go vap hcm',
          phone: '000000000000',
          gender: 1,
          identityCard: null,
          roleId: role._id,
          isActive: true
        })
        userSave.save((err, u) => {
          return cb(err, u)
        })
      })
    }
    async.waterfall([role, user], (err, data) => {
      if (err) global.logger.error('create user erorr')
      else {
        global.logger.info('userdata: ' + data._id)
      }
    })
  }
}
