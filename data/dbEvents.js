/*
 * Name / Events相关数据库借口(Server Render)
 * Author / T.T
 * Time / 2016-11-2
 */

var db = require('./dbConnect');

module.exports = {
    getEventsList: function (pagesize, pagenum, callback) {
        var pageSize = parseInt(pagesize);
        var pageNum = parseInt(pagenum);
        var sql = "SELECT pipa_events.id, pipa_events.name, pipa_events.headimg, " +
            "pipa_events.create_time, pipa_events.start_time, " +
            "pipa_user.name as host_name, pipa_space.name as space_name " +
            "FROM pipa_events " +
            "INNER JOIN pipa_user ON pipa_user.id = pipa_events.host_user_id " +
            "INNER JOIN pipa_space ON pipa_space.id = pipa_events.space_id " +
            "ORDER BY create_time DESC " +
            "LIMIT " + (pageSize * pageNum) + "," + (pageNum + 1) * pageSize;
        db.query(sql, function (err, rows, fields) {
            callback(err, rows);
        });
    },
    getEventsDetails: function (id, callback) {
        var sql = "SELECT pipa_events.id, pipa_events.name, pipa_events.details, pipa_events.headimg, " +
            "pipa_events.create_time, pipa_events.start_time, pipa_events.end_time, " +
            "pipa_events.max_capacity, pipa_user.name as host_name, pipa_space.name as space_name " +
            "FROM pipa_events " +
            "INNER JOIN pipa_user ON pipa_user.id = pipa_events.host_user_id " +
            "INNER JOIN pipa_space ON pipa_space.id = pipa_events.space_id " +
            "WHERE pipa_events.id = " + id;
        db.query(sql, function (err, rows, fields) {
            callback(err, rows);
        });
    }
}