
const permisions = {
  user: {
    label: 'user',
    role: [
      { key: 'USERVIEW', text: 'View' },
      { key: 'USERADD', text: 'Add' },
      { key: 'USEREDIT', text: 'Edit' }
    ]
  },
  account: {
    label: 'Account',
    role: [
      { key: 'ACCOUNTVIEW', text: 'View' },
      { key: 'ACCOUNTADD', text: 'Add' },
      { key: 'ACCOUNTEDIT', text: 'Edit' }
    ]
  },
  category: {
    label: 'Category',
    role: [
      { key: 'CATEGORYVIEW', text: 'View' },
      { key: 'CATEGORYADD', text: 'Add' },
      { key: 'CATEGORYEDIT', text: 'Edit' }
    ]
  },
  product: {
    label: 'Product',
    role: [
      { key: 'PRODUCTVIEW', text: 'View' },
      { key: 'PRODUCTADD', text: 'Add' },
      { key: 'PRODUCTEDIT', text: 'Edit' }
    ]
  },
  advertise: {
    label: 'Advertise',
    role: [
      { key: 'ADVERTISEVIEW', text: 'View' },
      { key: 'ADVERTISEADD', text: 'Add' },
      { key: 'ADVERTISEEDIT', text: 'Edit' }
    ]
  },
  post: {
    label: 'Post',
    role: [
      { key: 'POSTVIEW', text: 'View' },
      { key: 'POSTADD', text: 'Add' },
      { key: 'POSTEDIT', text: 'Edit' }
    ]
  },
  gallery: {
    label: 'Gallery',
    role: [
      { key: 'GALLERYEDIT', text: 'Edit' }
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
