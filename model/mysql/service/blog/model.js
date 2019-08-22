
var model = {
  table: 'blog',
  view: 'viewbloginfo',
  schema: {
    id: { type: 'string', require: false, regex: null, isValid: null },
    code: { type: 'string', require: true, regex: null, isValid: null },
    title: { type: 'string', require: true, regex: null, isValid: null },
    intro_title: { type: 'string', require: true, regex: null, isValid: null },

    intro_description: { type: 'string', require: true, regex: null, isValid: null },
    description: { type: 'string', require: true, regex: null, isValid: null },

    content: { type: 'string', require: true, regex: null, isValid: null },
    collections: { type: 'string', require: true, regex: null, isValid: null },

    intro_image: { type: 'string', require: true, regex: null, isValid: null },
    image: { type: 'string', require: true, regex: null, isValid: null },

    img_title: { type: 'string', require: true, regex: null, isValid: null },
    partner_id: { type: 'string', require: true, regex: null, isValid: null },

    category_id: { type: 'string', require: true, regex: null, isValid: null },
    acc_id: { type: 'string', require: true, regex: null, isValid: null },
    box_content: { type: 'sting', require: true, regex: null, isValid: null },
    active_date: { type: 'string', require: true, regex: null, isValid: null },
    is_active: { type: 'boolean', default: 0, regex: null, isValid: null },
    is_delete: { type: 'boolean', default: 0, regex: null, isValid: null },
    create_date: { type: 'string', require: false, regex: null, isValid: null },
    update_date: { type: 'string', require: false, regex: null, isValid: null },

    status: { type: 'string', require: false, regex: null, isValid: null },
    author: { type: 'string', require: false, regex: null, isValid: null },
    note: { type: 'string', require: false, regex: null, isValid: null }
  }
}

module.exports = model
