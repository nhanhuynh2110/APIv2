
const permisions = {
  user: {
    label: 'user',
    role: [
      { key: 'USERVIEW', text: 'View' },
      { key: 'USERADD', text: 'Add' },
      { key: 'USEREDIT', text: 'Edit' }
    ]
  },
  category: {
    label: 'Category',
    role: [
      { key: 'CATEGORYVIEW', text: 'View' },
      { key: 'CATEGORYADD', text: 'Add' },
      { key: 'CATEGORYEDIT', text: 'Edit' }
    ]
  }
}

module.exports.hasPermissions = (permissionsUser = []) => {
  const keys = Object.keys(permisions)
  keys.map((key) => {
    return permisions[key].role.map((r) => {
      r.isActive = permissionsUser.includes(r.key)
      return r
    })
  })

  return permisions
}

module.exports.permisisons = () => {
  return permisions
}
