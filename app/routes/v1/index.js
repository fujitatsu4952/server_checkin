var express = require('express');
// ルーティングする
var router = express.Router();
const connection = require('../../app').connection
// エスケープ処理
var SqlString = require('sqlstring');
function getEscapeString(input){
  return SqlString.escape(`%${input}%`);
};

// routerにルーティングの動作を書いてく
router.get('/', function (req, res) {
  console.log('hello');
  connection.query('select * from hotel_mast ', 
  function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.json(results);
  });
});

//予約者情報を取得する
router.post('/', (req, res) => {
  console.log(getEscapeString(req.body.checkin_name_or_id));
  console.log(req.body.checkin_name_or_id);
  connection.query(`
  select * from guest_mast 
    inner join hotel_mast
      on guest_mast.hotel_id = hotel_mast.hotel_id
  where ((guest_mast.name LIKE ${getEscapeString(req.body.checkin_name_or_id)}) or (guest_mast.reservation_id LIKE ${getEscapeString(req.body.checkin_name_or_id)})) 
        and 
        (hotel_mast.hotel_id = '${req.body.select_hotel}') 
        and 
        (guest_mast.checkin_date LIKE ${getEscapeString(req.body.checkin_date)})`,
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    });
});

// スタッフ担当者の入力を受け取る
router.post('/staffname', function (req, res) {
  console.log('hello');
  connection.query(`
  UPDATE guest_mast
  SET staff_name = '${req.body.staff_name}'
  WHERE reservation_id = '${req.body.reserve}' 
        AND 
        hotel_id = '${req.body.hotel}'
  ;`, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.json(results);
  });
});

// ホテル情報を手に入れる
router.get('/hotel', function (req, res) {
  console.log('hello');
  connection.query('select * from hotel_mast', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.json(results);
  });
});

// ホテル情報の変更を受け取る
router.post('/update', (req, res) => {
  connection.query(`
  UPDATE hotel_mast
  SET hotel_name = ${SqlString.escape(req.body.hotel_name)}, hotel_pass = ${SqlString.escape(req.body.hotel_pass)}
  WHERE hotel_id = '${req.body.hotel_id}'
  ;`,
  function (error, results, fields) {
    if (error) throw error;
  });
});

// 新規のホテル情報を受け取る
router.post('/insert', (req, res) => {
  connection.query(`
  insert into hotel_mast (hotel_name, hotel_id, hotel_pass)
  VALUES (${SqlString.escape(req.body.new_hotel_name)}, ${SqlString.escape(req.body.new_hotel_id)}, ${SqlString.escape(req.body.new_hotel_pass)})
  ;`, 
  function (error, results, fields) {
    if (error) throw error;
  });
});

//チェックインフォーム入力を受けとるAPI
router.post('/checkin', (req, res) => {
  console.log(req.body.name)
  connection.query(`
  UPDATE guest_mast 
  SET country = '${req.body.country}', name = ${SqlString.escape(req.body.name)}, age = '${req.body.age}', address = ${SqlString.escape(req.body.address)}, work = '${req.body.work}',work_type = '${req.body.work_type}', 
  tell_number = ${SqlString.escape(req.body.tell)}, sex = '${req.body.sex}',checkingtime = '${req.body.checkingtime}', status = "済"
  WHERE reservation_id = '${req.body.reserve}' 
        AND 
        hotel_id = '${req.body.hotel}';`, 
  function (error, results, fields) {
    if (error) throw error;
  });
});

//routerをモジュールとして扱う準備
module.exports = router;