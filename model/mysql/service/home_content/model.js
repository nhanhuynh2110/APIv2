var model = {
    table: 'home_content',
    view: 'viewhomecontent',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        title: { type: 'string', require: true, regex: null, isValid: null },
        description: { type: 'string', require: false, regex: null, isValid: null },
        content: { type: 'string', require: false, regex: null, isValid: null },
        is_active: { type: 'boolean', default: 0, require: false, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0, require: false, regex: null, isValid: null },
        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },
        active_date: { type: 'string', require: false, regex: null, isValid: null }
    }
}
module.exports = model