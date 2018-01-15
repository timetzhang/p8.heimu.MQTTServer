/*
 * Name / Devices相关数据库借口(Server Render)
 * Author / T.T
 * Time / 2016-11-2
 */

var db = require('./dbConnect');

module.exports = {
    getChipIdAndCommandCode: function (building, room, device, callback) {
        var sql = "SELECT pipa_chip.name, pipa_device.command_code " +
            "FROM pipa_chip " +
            "INNER JOIN pipa_device on pipa_device.chip_id = pipa_chip.id " +
            "INNER JOIN pipa_space on pipa_space.id = pipa_device.space_id " +
            "INNER JOIN pipa_building on pipa_building.id = pipa_space.building_id " +
            "WHERE pipa_building.name = '" + building + "' AND pipa_space.room = '" + room + "' AND pipa_device.name = '" + device + "'";
        db.query(sql, function (err, rows, fields) {
            callback(err, rows[0]);
        });
    }
}