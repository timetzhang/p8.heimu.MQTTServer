/*
 * Name / Devices相关数据库借口(Server Render)
 * Author / T.T
 * Time / 2016-11-2
 */

var db = require('./dbConnect');
var py = require('../common/ctopy');

module.exports = {
    getHeimuSpeak: function (data, callback) {
        var sql = "SELECT speak " +
            "FROM heimu_language " +
            "WHERE (INSTR('" + data + "', listen) > 0) OR (INSTR('" + py.getPY(data) + "', listen_pinyin) > 0)";
        db.query(sql, function (err, rows, fields) {
            if (rows[0] !== undefined) {
                callback(rows[0]['speak']);
            }
            else {
                callback(false);
            }
        });
    }
}