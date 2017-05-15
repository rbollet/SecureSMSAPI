var app = require('../app');
var salt = require('../private/config').secret;
var User = require('../models/userDB');
var uuid = require('node-uuid');
var express = require('express');
var router = express.Router();

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}


var checkToken = require('../auth/checkToken');

var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
moment.locale('fr');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({
        error: true,
        data: {
            msg: 'Non autorisé'
        }
    });
});

/* POST - Gestion des apprenants - Créer un apprenant */
router.post('/create', function (req, res) {

    //Check complexe password
    //Ckeck uid

    if (req.body.password && req.body.password.length > 5) {

        var uid = uuid.v4();
        var password = req.body.password;
        var hash = crypto.createHash('sha512').update(uid + password + salt, 'utf-8').digest('hex');
            
        var newUser = new User({
            identifiant: uid,
            password: hash
        });

        newUser.save()
                .then(function () {

                    res.json({
                        error: false,
                        uid: uid,
                        msg: 'Votre compte a été bien créé !',
                        alert: 'success'
                    });

                }, function (err) {
                    console.log(err);
                    res.json({
                        error: true,
                        msg: 'Le mot de passe ne respecte pas la complexité.',
                        alert: 'warning'
                    });

                });
    } else {

        res.json({
            error: true,
            msg: 'Le mot de passe ne respecte pas la complexité.',
            alert: 'warning'
        });
    }
});



module.exports = router;
