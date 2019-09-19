var permissionDefine = require('./permission_define')

module.exports = {
  user: [
    permissionDefine.USERVIEW,
    permissionDefine.USERREVIEW,
    permissionDefine.USERADD,
    permissionDefine.USEREDIT,
    permissionDefine.USERDELETE,
    permissionDefine.CHGPERMISSIONUSER
  ],
  categrory: [
    permissionDefine.CATEGORYVIEW,
    permissionDefine.CATEGORYREVIEW,
    permissionDefine.CATEGORYADD,
    permissionDefine.CATEGORYEDIT,
    permissionDefine.CATEGORYDELETE
  ],
  pemissions: [
    permissionDefine.PERMISSIONSVIEW,
    permissionDefine.PERMISSIONSREVIEW,
    permissionDefine.PERMISSIONSADD,
    permissionDefine.PERMISSIONSEDIT,
    permissionDefine.PERMISSIONSDELETE
  ]
}
