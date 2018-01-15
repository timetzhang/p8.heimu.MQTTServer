/*
 * Name / Space相关数据库借口(Server Render)
 * Author / T.T
 * Time / 2016-11-2
 */

var db = require('./dbConnect');
var time = require('../common/time');

module.exports = {
    getSpaceList: function (pagesize, pagenum, callback) {
        var pageSize = parseInt(pagesize);
        var pageNum = parseInt(pagenum);
        var sql = "SELECT pipa_space.id, pipa_space.name, pipa_space.details, pipa_space.headimg, pipa_building.name AS building_name " +
            "FROM pipa_space " +
            "INNER JOIN pipa_building ON pipa_space.building_id = pipa_building.id " +
            "WHERE type_id > 100 " +
            "LIMIT " + (pageSize * pageNum) + "," + (pageNum + 1) * pageSize;
        db.query(sql, function (err, rows, fields) {
            callback(err, rows);
        });
    },
    getSpaceDetails: function (id, callback) {
        var sql = "SELECT pipa_space.id, pipa_space.name, pipa_space.details, " +
            "pipa_space.open_time, pipa_space.close_time, pipa_space.headimg, " +
            "pipa_space.max_capacity, pipa_building.name AS building_name, " +
            "pipa_space.area, pipa_space.room, pipa_space.area_unit_price, " +
            "pipa_space.power_unit_price, pipa_space.water_unit_price, pipa_space.gas_unit_price " +
            "FROM pipa_space " +
            "INNER JOIN pipa_building ON pipa_space.building_id = pipa_building.id " +
            "WHERE pipa_space.id = " + id;
        db.query(sql, function (err, rows, fields) {
            callback(err, rows);
        });
    },
    getSpaceEvents: function (id, callback) {
        var sql = "SELECT pipa_events.id, pipa_events.name, pipa_events.headimg, pipa_events.details, " +
            "pipa_events.start_time, pipa_events.end_time, pipa_user.name as host_name, pipa_user.headimg as host_headimg " +
            "FROM pipa_events " +
            "INNER JOIN pipa_user ON pipa_events.host_user_id = pipa_user.id " +
            "WHERE (pipa_events.start_time >= '" + time.Now.getDate() + "') AND (pipa_events.space_id = " + id + ")";
        db.query(sql, function (err, rows, fields) {
            callback(err, rows);
        });
    }
}