var express = require('express');
// ルーティングするで
var router = express.Router();
var temp = []

// routerにルーティングの動作を書いてく
router.get('/', function (req, res) {
  console.log('hello');

  const connection = require('../../app').connection
  connection.query('select * from hotel_mast ', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.json(results);

  });
});

router.post('/', (req, res) => {
  console.log(req.body.search);
  temp.push(req.body);

  // 言語はjavascript
  const connection = require('../../app').connection
  console.log(req.body)
  connection.query(`select * from guest_mast 
        inner join hotel_mast
          on guest_mast.hotel_id = hotel_mast.hotel_id
        where ((guest_mast.name LIKE "%${req.body.search}%") or (guest_mast.reservation_id              LIKE "%${req.body.search}%")) 
          and 
              (hotel_mast.hotel_id = "${req.body.hotel}") 
          and 
              (guest_mast.checkin_date LIKE '%${req.body.date}%')`,
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
      // insert into todos (title, status) VALUES("アイロン", 0);
    });

});


//routerをモジュールとして扱う準備
module.exports = router;