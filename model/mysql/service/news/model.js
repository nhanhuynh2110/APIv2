
var model = {
    table: 'news',
    view: 'viewnewsinfo',
    schema: {
        id: { type: 'string', require: false, regex: null, isValid: null },
        code: { type: 'string', require: true, regex: null, isValid: null },
        title: { type: 'string', require: true, regex: null, isValid: null },
        intro_title: { type: 'string', require: true, regex: null, isValid: null },

        intro_description: { type: 'string', require: true, regex: null, isValid: null },
        description: { type: 'string', require: true, regex: null, isValid: null },

        content: { type: 'string', require: true, regex: null, isValid: null },
        collection: { type: 'string', require: true, regex: null, isValid: null },

        intro_image: { type: 'string', require: true, regex: null, isValid: null },
        image: { type: 'string', require: true, regex: null, isValid: null },

        img_title: { type: 'string', require: true, regex: null, isValid: null },

        category_news_id: { type: 'string', require: true, regex: null, isValid: null },

        is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
        is_delete: { type: 'boolean', default: 0, regex: null, isValid: null },
        create_date: { type: 'string', require: false, regex: null, isValid: null },
        update_date: { type: 'string', require: false, regex: null, isValid: null },
        active_date: { type: 'string', require: true, regex: null, isValid: null },
    }
}

module.exports = model

