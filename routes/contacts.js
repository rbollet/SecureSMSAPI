var app = require('../app');
var User = require('../models/userDB');
var express = require('express');
var router = express.Router();

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

var checkContact = require('../services/checkContact');
var checkToken = require('../auth/checkToken');

var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
moment.locale('fr');

/* GET contacts list of user */
router.get('/contacts', checkToken(), function (req, res, next) {

    var id = req.decoded._doc._id;
    //var contacts = req.decoded._doc.contacts;

    User.findById(id).populate('contacts').exec(function (err, user) {

        if (!user) {

            res.status(401).json({
                error: true,
                auth: false,
                msg: 'Attention ! Vous devez vous reconnecter !',
                alert: 'warning',
                code: 1
            });

        } else {

            let contacts = [];
            
            user.contacts.forEach(function (contact){
               contacts.push({uid : contact.uid}) ;
            });

            res.json({
                error: false,
                contacts: contacts,
                alert: 'success'
            });
        }
    });


});

/* Find a contact by uid */
router.post('/find/contact', checkToken(), checkContact(), function (req, res, next) {

    var uid = req.contact.uid;

    User.find({uid : uid  }).exec(function (err, contact) {

        console.log(contact);

        if (contact) {
            res.json({
                error: "false",
                uid: uid,
                alert: "success"
            });
            
        }else{
            res.json({
                error: "true",
                uid: "false",
                alert: "warning"
            });
        }
            
    });
});

/* POST add contact */
router.post('/add/contact', checkToken(), checkContact(), function (req, res, next) {

    var idUser = req.decoded._doc._id;
    var contact = req.contact;

    User.findById(idUser).exec(function (err, user) {

        console.log(user);

        if (user) {

            user.contacts.push(contact);

            user.save()
                    .then(function () {

                        res.json({
                            error: false,
                            contact: true,
                            alert: 'success'
                        });
                    }, function (err) {

                        res.json({
                            error: true,
                            contact: false,
                            alert: 'warning'
                        });
                    });
        }
    });
});

/* POST a new sms */
router.post('/add/sms', checkToken(), checkContact(), function (req, res, next) {

    var idUser = req.decoded._doc._id;
    var contact = req.contact;

    //Créer checkRoom : si uid room existe, donc on a déjà une room créée entre deux users
    // si pas uid room, on doit initialiser une nouvelle room
    
    // vérifier idUser = from
    // vérifier checkContact = to
    
    // vérifier si sms string existe
    
    // Ajouter sms, from, to, date, expire, time, etat, et room (nouvelle ou existante)
    
    // Ajouter le sms créé dans la salle
    
    // Envoi une notification à l'utilisateur : voir pour intégrer socket.io dans Swift3
    
    // L'utilisateur doit cliquer sur l'icone pour visualiser le message

    
});



module.exports = router;
