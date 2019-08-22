var handleBoolean = require('../../../../helper/handleBoolean')

var validateForm = function(form) {
    if (!form.title || !form.introTitle || !form.introImg || !form.img || 
        !form.cate || !form.account)
    {
        return false
    } else {
        return true
    }
}
exports.validateForm = validateForm