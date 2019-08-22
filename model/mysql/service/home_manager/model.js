var model = {
    table: 'home_manager',
    view: 'viewhomemanager',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        title: { type: 'string', require: true, regex: null, isValid: null },
        layout: { type: 'string', require: false, regex: null, isValid: null },
        is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0, regex: null, isValid: null },
        category_code: { type: 'category_code', require: false, regex: null, isValid: null },
        short_title: { type: 'string', require: false, regex: null, isValid: null },
        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },
        blogs: { type: 'string', require: false, regex: null, isValid: null }
    }
}

module.exports = model

