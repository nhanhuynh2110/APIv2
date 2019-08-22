var model = {
    table: 'produce',
    view: 'viewproduce',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        title: { type: 'string', require: true, regex: null, isValid: null },
        image: { type: 'string', require: false, regex: null, isValid: null },
        description: { type: 'string', require: false, regex: null, isValid: null },
        address: { type: 'string', require: false, regex: null, isValid: null },
        phone: { type: 'string', require: false, regex: null, isValid: null },
        mobile: { type: 'string', require: false, regex: null, isValid: null },
        email: { type: 'string', require: false, regex: null, isValid: null },
        website: { type: 'string', require: false, regex: null, isValid: null },
        is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0, regex: null, isValid: null },
        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },
        active_date: { type: 'string', require: false, regex: null, isValid: null }
    }
}
module.exports = model

