var per = {
  super: 1,
  all: 2,
  view: 3,
  create: 4,
  update: 5,
  delete: 6,
  choosepartner: 7
}

var permission = {
  superAdmin: [per.super],
  user: [per.all, per.view, per.create, per.update, per.delete],
  customer: [per.all, per.view, per.create, per.update, per.delete],
  blog: [per.all, per.view, per.create, per.update, per.delete, per.choosepartner],
  category: [per.all, per.view, per.create, per.update, per.delete],
  homemagager: [per.all, per.view, per.create, per.update, per.delete],
  video: [per.all, per.view, per.create, per.update, per.delete],
  partner: [per.all, per.view, per.create, per.update, per.delete]
}

var overviewPermission = {
  permission: permission,
  rule: per
}

var hasPermission = (parent = null, rule = 0) => {
  if (!parrent) return false
  for (var key in permission) {
      if (key === parent) {
            return (permission[key].find((el) => el === rule))
      }
  }
  return false
}

module.exports = {
    permission: permission,
    hasPermission: hasPermission,
    overviewPermission: overviewPermission
}