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
var checkPassword = require('../services/checkPassword');
var checkContact = require('../services/checkContact');

var checkToken = require('../auth/checkToken');

var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
moment.locale('fr');


/* GET users homepage test */
router.get('/', function (req, res, next) {
    res.json({
        error: false,
        data: {
            msg: 'test ok'
        }
    });
});

/* POST - Create an user */
router.post('/create', checkPassword(), function (req, res) {

    //Check complexe password
    //Ckeck uid in database to be sure a uuid

    var password = req.checkPassword;

    console.log('password : ' + password);

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
                    uid: false,
                    msg: 'Le mot de passe ne respecte pas la complexité.',
                    alert: 'warning'
                });
            });
});

/* POST - Login page. */
router.post('/login', checkFormLogin(), function (req, res, next) {

    var uid = req.body.uid;
    var password = req.body.password;

    User.findOne({uid: uid}).populate('contacts').exec(function (err, user) {

        if (!user) {

            res.status(401).json({
                error: true,
                auth: "no",
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
                    auth: "no",
                    msg: 'Attention ! Vos identifiants sont erronés !',
                    alert: 'warning',
                    code: 2
                });

            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, req.app.get('config').secret, {
                    expiresIn: 36000 // expires in 1 hour
                });

                new Cookies(req, res).set('access_token', token, {
                    httpOnly: true,
                    secure: false      // for your production environment
                });

                res.json({
                    error: false,
                    auth: "yes",
                    contacts: user.contacts,
                    msg: 'Vous êtes connecté !',
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

/* POST - Update password */
router.post('/modify/password', checkToken(), function (req, res, next) {

    console.log('uid : ' + req.body.uid);
    console.log('decoded uid : ' + req.decoded._doc.uid);
    console.log('old : ' + req.body.oldpassword);
    console.log('new : ' + req.body.newpassword);

    if (req.decoded._doc.uid === req.body.uid) {

        var uid = req.decoded._doc.uid;
        var oldpassword = req.body.oldpassword;
        var oldhash = crypto.createHash('sha512').update(uid + oldpassword + req.app.get('config').secret, 'utf-8').digest('hex');

        User.findOne({
            $and: [{uid: uid}, {password: oldhash}]

        }).exec(function (err, user) {

            if (!user) {

                res.status(401).json({
                    error: true,
                    logout: false,
                    msg: 'Attention ! Vos identifiants sont erronés !',
                    alert: 'warning',
                    code: 1
                });

            } else {
                console.log(user);

                var newpassword = req.body.newpassword;
                var newhash = crypto.createHash('sha512').update(uid + newpassword + req.app.get('config').secret, 'utf-8').digest('hex');

                var attributs = {
                    password: newhash
                };

                User.findByIdAndUpdate(user._id, attributs, function (err, user) {
                    if (err) {

                        res.json({
                            error: true,
                            logout: false,
                            msg: 'Pas de changement de mot de passe !',
                            alert: 'warning'
                        });
                    } else {

                        new Cookies(req, res).set('access_token', '', {
                            httpOnly: true,
                            secure: false      // for your production environment
                        });

                        res.json({
                            error: false,
                            logout: true,
                            msg: 'Mot de passe changé ! Vous allez être déconnecté !',
                            alert: 'success'
                        });
                    }
                });
            }
        });

    } else {
        res.json({
            error: true,
            msg: 'Vous n\'avez pas saisi le mot de passe actuel !',
            alert: 'warning'
        });
    }

});

module.exports = router;
