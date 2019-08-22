var model = {
    table: 'category_news',
    view: 'viewcategorynews',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        title: { type: 'string', require: true, regex: null, isValid: null },
        logo: { type: 'string', require: false, regex: null, isValid: null },
        link: { type: 'string', require: false, regex: null, isValid: null },
        is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0, regex: null, isValid: null },
        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },
        is_home: { type: 'boolean', default: 0, require: false, regex: null, isValid: null },
        sort: { type: 'string', require: false, regex: null, isValid: null },
    }
}

module.exports = model

