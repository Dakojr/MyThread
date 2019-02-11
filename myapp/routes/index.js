var express = require('express');
var router = express.Router();

const User = require('../controler/user_controler') //.js
const user = User;

console.log(user);

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(User);
  res.render('index', { title: 'Express' });
});

module.exports = router;