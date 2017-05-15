var app = require('../app');

var User = require('../models/userDB');

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var Cookies = require("cookies");

var checkToken = require('../auth/checkToken');

var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
moment.locale('fr');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET erreur */
router.get('/erreur', function (req, res, next) {
    
    res.json({
        error: true,
        data: {
           msg: 'Non autorisé'
        }
    });
});



module.exports = router;
