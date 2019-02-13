const express = require('express');
const Promise = require('bluebird')
const router = express.Router();

const UserControl = require('./../controlers/usercontroler')



/* GET home page. */
router.get('/', function (req, res, next) {
  UserControl.getUser()
    .then((User) => {
      res.render('pages/index', { User: User })
    })
});

router.get('/about', function (req, res, next) {
  UserControl.getUser()
    .then((User) => {
      res.render('pages/about', { User: User })
    })
});

module.exports = router