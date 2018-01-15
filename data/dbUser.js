/*
 * Name / User相关数据库借口(Server Render)
 * Author / T.T
 * Time / 2016-11-2
 */

var db = require('./dbConnect');

module.exports = {
    getUserHead: function (id, callback) {
        var sql = "SELECT name, headimg FROM pipa_user WHERE (id = " + id + ")";
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },
    getUserInfo: function (id, callback) {
        var sql = "SELECT name, sex, dob, id_number, cellphone, wechat_id, qq, email, telephone, address, city, province, country, headimg, password, note, time, role_id " +
            "FROM pipa_user " +
            "WHERE (id = " + id + ")";
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },

    getUserEvents: function (id, callback) {
        var sql = "SELECT pipa_events.id, pipa_events.name, pipa_events.headimg, " +
            "pipa_events.create_time, pipa_events.start_time, " +
            "pipa_space.name as space_name " +
            "FROM pipa_events " +
            "INNER JOIN pipa_space ON pipa_space.id = pipa_events.space_id " +
            "WHERE (host_user_id = " + id + ") AND (end_time > NOW())" +
            "ORDER BY create_time DESC";
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },
    getUserSpace: function (id, callback) {
        var sql = "SELECT pipa_space.id, pipa_space.name, pipa_space.details, pipa_space.headimg, pipa_building.name AS building_name " +
            "FROM pipa_space " +
            "INNER JOIN pipa_building ON pipa_space.building_id = pipa_building.id " +
            "INNER JOIN pipa_user_space_application ON pipa_user_space_application.space_id = pipa_space.id " +
            "INNER JOIN pipa_user_space_payment ON pipa_user_space_payment.application_id = pipa_user_space_application.id " +
            "WHERE pipa_space.type_id > 100 AND pipa_user_space_payment.user_id = " + id + " AND pipa_user_space_payment.is_paid = true";
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },

    getUserFavEvents: function (id, callback) {
        var sql = "SELECT pipa_events.id, pipa_events.name, pipa_events.headimg, " +
            "pipa_events.create_time, pipa_events.start_time, " +
            "pipa_space.name as space_name " +
            "FROM pipa_user_fav_events " +
            "INNER JOIN pipa_events ON pipa_events.id = pipa_user_fav_events.events_id " +
            "INNER JOIN pipa_space ON pipa_space.id = pipa_events.space_id " +
            "WHERE (pipa_user_fav_events.user_id = " + id + ")";
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },
    getUserFavSpace: function (id, callback) {
        var sql = "SELECT pipa_space.id, pipa_space.name, pipa_space.details, pipa_space.headimg, pipa_building.name AS building_name " +
            "FROM pipa_user_fav_space " +
            "INNER JOIN pipa_space ON pipa_space.id = pipa_user_fav_space.space_id " +
            "INNER JOIN pipa_building ON pipa_space.building_id = pipa_building.id " +
            "WHERE (pipa_user_fav_space.user_id = " + id + ")";
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },

    getUserSpaceApplication: function (id, callback) {
        var sql = "SELECT pipa_user_space_application.id, " +
            "pipa_user_space_application.name, " +
            "pipa_user_space_application.time, " +
            "pipa_user_space_application.details, " +
            "pipa_user_space_application.time_from, " +
            "pipa_user_space_application.time_to, " +
            "pipa_user_space_application.is_approved, " +
            "pipa_space.name AS space_name " +
            "FROM pipa_user_space_application " +
            "INNER JOIN pipa_space ON pipa_space.id = pipa_user_space_application.space_id " +
            "WHERE pipa_user_space_application.user_id = " + id
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },
    getUserSpacePayment: function (id, callback) {
        var sql = "SELECT pipa_user_space_payment.id, " +
            "pipa_user_space_payment.subject, " +
            "pipa_user_space_payment.details, " +
            "pipa_user_space_payment.total, " +
            "pipa_user_space_payment.direction, " +
            "pipa_user_space_payment.create_time, " +
            "pipa_user_space_payment.is_paid, " +
            "pipa_user_space_payment.paid_time, " +
            "pipa_user_space_payment.is_closed, " +
            "pipa_user_space_payment.closed_time, " +
            "pipa_user_space_application.name AS application_name " +
            "FROM pipa_user_space_payment " +
            "WHERE pipa_user_space_payment.user_id = " + id
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },
    getUserEventsPayment: function (id, callback) {
        var sql = "SELECT pipa_user_events_payment.id, " +
            "pipa_user_events_payment.subject, " +
            "pipa_user_events_payment.details, " +
            "pipa_user_events_payment.total, " +
            "pipa_user_events_payment.direction, " +
            "pipa_user_events_payment.create_time, " +
            "pipa_user_events_payment.is_paid, " +
            "pipa_user_events_payment.paid_time, " +
            "pipa_user_events_payment.is_closed, " +
            "pipa_user_events_payment.closed_time, " +
            "pipa_user_events_payment.closed_time, " +
            "pipa_user_events_payment.closed_time " +
            "pipa_events.name AS events_name " +
            "FROM pipa_user_events_payment " +
            "INNER JOIN pipa_events ON pipa_events.id = pipa_user_events_payment.event_id"
            "WHERE pipa_user_events_payment.user_id = " + id
        db.query(sql, function (err, rows, fields) {
            callback(err, JSON.parse(JSON.stringify(rows)));
        });
    },
}