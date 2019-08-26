const permissionType = require('./permision_type')

let hasPermission = (eventPermission, type) => {
  if (!(type in permissionType)) return false
  let permissionList = permissionType[type]
  return permissionList.includes(eventPermission)
}

let getPermissions = () => {
  return permissionType
}

exports.hasPermission = hasPermission
exports.getPermissions = getPermissions
