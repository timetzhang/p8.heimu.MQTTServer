var py = require('./ctopy');
var db = require('../data/dbConnect');

var sql = 'select id, listen from heimu_language';
db.query(sql, function (err, rows, fields) {

    for (var i = 0; i < rows.length; i++) {
        console.log(rows[i]['id'] + '.' + rows[i]['listen'] + ' > ' + py.getPY(rows[i]["listen"]));
        var sqlpy = "update heimu_language set listen_pinyin = '" + py.getPY(rows[i]["listen"]) + "' where id = " + rows[i]['id'];
        db.query(sqlpy, function (err, rows, fields) {
            console.log(rows);
        });
    }
});