/*
 * Name / 数据库连接
 * Author / T.T
 * Time / 2016-10-30
 */

var mysql = require('mysql');

var pool = mysql.createPool({
    host: '120.77.52.148',
    user: 'root',
    password: 'cl3bkm4fuc',
    port: '3306',
    database: 'pipa'
});

module.exports = {
    query: function (sql, callback) {

        if (!sql) {
            callback();
            return;
        }

        pool.getConnection(function (err, connection) {
            connection.query(sql, function (err, rows, fields) {

                if (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                };

                connection.release();

                callback(null, rows, fields);
            });
        });
    }
}