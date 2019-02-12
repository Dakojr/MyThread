const express = require('express');
const Promise = require('bluebird')
const router = express.Router();

const UserControl = require('./../controlers/usercontroler')

let User = {}

UserControl.getUser()
  .then((data) => {
    data.user.forEach(element => {
      User.username = element.username
      User.password = element.password
      User.email = element.email
      User.telephone = element.telephone
      User.date_user = element.date_user
    });
    console.log(User)
  })

/* GET home page. */
router.get('/', function (req, res, next) {

});

module.exports = router;