var model = {
    table: 'partner',
    view: 'viewpartner',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        name: { type: 'string', require: true, regex: null, isValid: null },
        company: { type: 'string', require: false, regex: null, isValid: null },
        email: { type: 'string', regex: null, isValid: null },
        phone: { type: 'string', regex: null, isValid: null },
        address: { type: 'string', require: false, regex: null, isValid: null },
        logo: { type: 'string', require: false, regex: null, isValid: null },
        is_active: { type: 'boolean', default: 0, require: false, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0, require: false, regex: null, isValid: null },
        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },
        active_date: { type: 'string', require: false, regex: null, isValid: null }
    }
}

module.exports = model

