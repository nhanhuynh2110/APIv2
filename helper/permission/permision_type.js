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
  ],
  video: [
    permissionDefine.VIDEOVIEW,
    permissionDefine.VIDEOREVIEW,
    permissionDefine.VIDEOADD,
    permissionDefine.VIDEOEDIT,
    permissionDefine.VIDEODELETE
  ],
  blog: [
    permissionDefine.BLOGVIEWALL,
    permissionDefine.BLOGVIEWPERSONAL,
    permissionDefine.BLOGADD,
    permissionDefine.BLOGEDIT,
    permissionDefine.BLOGDELETE,
    permissionDefine.BLOGREVIEW,
    permissionDefine.BLOGNOTE
  ],
  partner: [
    permissionDefine.PARTNERVIEW,
    permissionDefine.PARTNERREVIEW,
    permissionDefine.PARTNERADD,
    permissionDefine.PARTNEREDIT,
    permissionDefine.PARTNERDELETE
  ],
  banner: [
    permissionDefine.BANNERVIEW,
    permissionDefine.BANNERREVIEW,
    permissionDefine.BANNERADD,
    permissionDefine.BANNEREDIT,
    permissionDefine.BANNERDELETE
  ],
  advertise: [
    permissionDefine.ADVERTISEVIEW,
    permissionDefine.ADVERTISEREVIEW,
    permissionDefine.ADVERTISEADD,
    permissionDefine.ADVERTISEEDIT,
    permissionDefine.ADVERTISEDELETE
  ],
  collection: [
    permissionDefine.COLLECTIONVIEW,
    permissionDefine.COLLECTIONREVIEW,
    permissionDefine.COLLECTIONADD,
    permissionDefine.COLLECTIONEDIT,
    permissionDefine.COLLECTIONDELETE
  ],
  home: [
    permissionDefine.HOMEMANAGERVIEW,
    permissionDefine.HOMEMANAGERADDBLOG
  ],
  categoryLayout: [
    permissionDefine.CATEGORYLAYOUTVIEW,
    permissionDefine.CATEGORYLAYOUTREVIEW,
    permissionDefine.CATEGORYLAYOUTADD,
    permissionDefine.CATEGORYLAYOUTEDIT,
    permissionDefine.CATEGORYLAYOUTDELETE
  ]
}
