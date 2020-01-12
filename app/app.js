var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var config = require('../config.json')[app.get('env')];

//表示
console.log(config.hoge);

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
});

module.exports = {
  connection,
}
// CORSを許可する
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// アクセスしてきたとき発動するapiの定義
app.get('/', function (req, res) {
  connection.query('select * from hotel_mast  ', function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});

var port = process.env.PORT || 3005; // port番号を指定

app.use('/api/v1', require('./routes/v1/'));

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);
console.log(app.get('env'));