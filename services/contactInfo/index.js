const {ContactInfo} = require('../../model/mongo')
var ObjectId = require('mongoose').Types.ObjectId
const {update} = require('../../model/mongo/util')

module.exports = {
  detail: () => ContactInfo.findOne({}),
  insert: (payload) => {
    const contactInfo = new ContactInfo(payload)
    return contactInfo.save()
  },
  updateById: (payload, id) => update(ContactInfo, {_id: ObjectId(id)}, payload)
}