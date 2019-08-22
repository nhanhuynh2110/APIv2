var checkIsBoolean = function(data) {
    return data.toLowerCase() === 'true' || data.toLowerCase() == 'false' || data === '1' || data === '0'
}

var convertBooleanToNumber = function(data) {
    var isboolean = checkIsBoolean(data)
    if (!isboolean && data !== '1' && data !== '0') return 0
    else return (data.toLowerCase() === 'true' || data === '1' ) ? 1 : 0
}

exports.checkIsBoolean = checkIsBoolean
exports.convertBooleanToNumber = convertBooleanToNumber
    