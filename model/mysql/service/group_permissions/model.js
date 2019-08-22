var model = {
  table: 'group_permission',
  view: 'viewgrouppermission',
  schema: {
    id: { type: 'string', require: false, regex: null, isValid: null },
    code: { type: 'string', require: true, regex: null, isValid: null },
    name: { type: 'string', require: true, regex: null, isValid: null },
    permissions: { type: 'string', require: true, regex: null, isValid: null },
    is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
    is_delete: { type: 'boolean', default: 0, regex: null, isValid: null },
    create_date: { type: 'string', require: false, regex: null, isValid: null },
    update_date: { type: 'string', require: false, regex: null, isValid: null },
    active_date: { type: 'string', require: false, regex: null, isValid: null }
  }
}
module.exports = model
