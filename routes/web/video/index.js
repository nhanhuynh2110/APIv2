var mysql = require('../../../model/mysql')
var config = require('../../../config/config')

module.exports = function (router) {
    router.get('/get-video', function (req, res) {
        var pageSize = (req.query.pageSize) ? req.query.pageSize : 9
        var pageNumber = (req.query.pageNumber) ? req.query.pageNumber : 1
        var key = ''
        var offset = parseInt(pageSize) * (parseInt(pageNumber) - 1)
        var sqlCount = `SELECT COUNT(*) AS count FROM viewvideo where is_delete = 0 AND is_active = 1;`
        var sql = `SELECT * FROM viewvideo where is_delete = 0 AND is_active = 1 Limit ${offset},${pageSize};`
        mysql.lib.query(sqlCount, true, (error, results, fields) => {
            if (error) return res.status(500).json({ status: 500, msg: 'request invalid' })
            if (results) {
                var video = results
                var count = (video && video[0] && video[0]['count']) ? video[0]['count'] : 0
                mysql.lib.query(sql, true, (err, _results, _fields) => {
                    var data = {
                        total: count,
                        rows: _results
                    }
                    if (err) return res.status(500).json({ status: 500, msg: 'request invalid' })
                    else return res.status(200).json({ status: 200, msg: 'success', data: data })
                })
            } else {
                return res.status(500).json({ status: 500, msg: 'request invalid' })
            }
        })

    })

    router.get('/video/homepage', (req, res) => {
        mysql.lib.query(`select * from viewvideo where is_active=1 and is_delete=0 order by create_date DESC limit 2`, true, (err, result, fields) => {
            if (err) {
                res.status(500).json({ status: 500, message: 'Get video fail' })
            } else {
                if (result) {
                    res.status(200).json({ status: 200, message: 'success', data: result })
                } else {
                    res.status(500).json({ status: 500, message: 'Get home manager fail' })
                }
            }
        })
    })
}
