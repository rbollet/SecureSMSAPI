var app = require('../app');
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

var jwt = require('jsonwebtoken');
var Cookies = require("cookies");
var checkFormLogin = require('../services/checkFormLogin');

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

/* POST - Create an user */
router.post('/create', function (req, res) {

    //Check complexe password
    //Ckeck uid in database to be sure a uuid

    if (req.body.password && req.body.password.length > 5) {
        var password = req.body.password;



        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasNonalphas = /\W/.test(password);

        console.log(hasNonalphas);
        if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 4) {
            res.json({
                error: true,

                msg: 'Votre mot de passe est trop faible !',
                alert: 'waring'
            });

        } else {



            var uid = uuid.v4();

            var hash = crypto.createHash('sha512').update(uid + password + req.app.get('config').secret, 'utf-8').digest('hex');

            var newUser = new User({
                uid: uid,
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
        }
    } else {

        res.json({
            error: true,
            msg: 'Le mot de passe ne respecte pas la complexité.',
            alert: 'warning'
        });
    }

});

/* POST - Login page. */
router.post('/login', checkFormLogin, function (req, res, next) {

    var uid = req.body.uid;
    var password = req.body.password;

    User.findOne({
        uid: uid
    }, function (err, user) {

        if (!user) {

            res.status(401).json({
                error: true,
                uid: uid,
                msg: 'Attention ! Vos identifiants sont erronés !',
                alert: 'warning',
                code: 1
            });

        } else {

            var hash = crypto.createHash('sha512').update(uid + password + req.app.get('config').secret, 'utf-8').digest('hex');

            // check if password matches
            if (hash !== user.password) {

                res.status(401).json({
                    error: true,
                    uid: uid,
                    msg: 'Attention ! Vos identifiants sont erronés !',
                    alert: 'warning',
                    code: 2
                });

            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, req.app.get('config').secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                new Cookies(req, res).set('access_token', token, {
                    httpOnly: true,
                    secure: false      // for your production environment
                });

                res.json({
                    error: false,
                    msg: '',
                    alert: 'success'
                });

            }
        }
    });
});

/* GET logout page. */
router.get('/logout', function (req, res, next) {

    new Cookies(req, res).set('access_token', '', {
        httpOnly: true,
        secure: false      // for your production environment
    });

    res.json({
        error: false,
        msg: 'Vous êtes déconnecté !',
        alert: 'success'
    });
});


/* GET test auth page. */
router.get('/auth', checkToken(), function (req, res, next) {

    if (req.decoded === false) {

        res.status(401).json({
            error: true,
            msg: 'Vous n\'êtes pas authentifié !',
            alert: 'warning'
        });

    } else {
        res.json({
            error: false,
            msg: 'ok',
            alert: 'success'
        });
    }
});


/* TODO POST - Update password */
router.post('/modify/password', checkToken(), function (req, res, next) {

    //Check complexe password
    //Ckeck uid

    if (req.body.oldpassword && req.body.newpassword.length > 7) {

        if (req.body.newpassword && req.body.newpassword.length > 7) {
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

        }

    } else {

        res.json({
            error: true,
            msg: 'Vous n\'avez pas saisi le mot de passe actuel !',
            alert: 'warning'
        });
    }
});


module.exports = router;
