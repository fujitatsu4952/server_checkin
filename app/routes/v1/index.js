var express = require('express');
// ルーティングするで
var router = express.Router();
const connection = require('../../app').connection

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

router.post('/', (req, res) => {
  connection.query(`
  select * from guest_mast 
    inner join hotel_mast
      on guest_mast.hotel_id = hotel_mast.hotel_id
  where ((guest_mast.name LIKE "%${req.body.checkin_name_or_id}%") or (guest_mast.reservation_id LIKE "%${req.body.checkin_name_or_id}%")) 
        and 
        (hotel_mast.hotel_id = "${req.body.select_hotel}") 
        and 
        (guest_mast.checkin_date LIKE '%${req.body.checkin_date}%')`,
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    });

});

//routerをモジュールとして扱う準備
module.exports = router;