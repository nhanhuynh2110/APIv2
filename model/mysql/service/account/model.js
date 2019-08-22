var model = {
    table: 'account',
    view: 'viewaccount',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        username: { type: 'string', require: true, regex: null, isValid: null },
        email: { type: 'string', require: true, regex: null, isValid: null },
        password: { type: 'string', require: true, regex: null, isValid: null },
        avatar: { type: 'string', require: true, regex: null, isValid: null },
        firstname: { type: 'string', require: false, regex: null, isValid: null },
        lastname: { type: 'boolean', default: 0, regex: null, isValid: null },
        fullname: { type: 'boolean', default: 0, regex: null, isValid: null },
        birthday: { type: 'string', require: false, regex: null, isValid: null },
        address: { type: 'string', require: false, regex: null, isValid: null },

        phone: { type: 'string', require: false, regex: null, isValid: null },
        facebook: { type: 'string', require: false, regex: null, isValid: null },
        google: { type: 'string', require: false, regex: null, isValid: null },
        gender: { type: 'boolean', require: false, regex: null, isValid: null },
        identity_card: { type: 'string', require: false, regex: null, isValid: null },
        hometown: { type: 'string', require: false, regex: null, isValid: null },

        is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0,require: false, regex: null, isValid: null },

        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },

        type: { type: 'string', require: false, regex: null, isValid: null }
    }
}

module.exports = model

