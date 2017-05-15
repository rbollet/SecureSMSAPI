/**
 * checkToken vérifie si l'user authentifié
 *
 */

var jwt = require('jsonwebtoken');
var Cookies = require("cookies");


function checkToken(groupe) {
    return function (req, res, next) {
        req.decoded = false;
        // check header or url parameters or post parameters for token
        // Pour l'authentification pour l'application mobile
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // Pour l'authentification par cookie
        if (!token) {
            var token = new Cookies(req, res).get('access_token');
        }

        if (typeof (token) !== 'undefined') {

            // verifies secret and checks exp
            jwt.verify(token, req.app.get('config').secret, function (err, decoded) {
                if (err) {
                    res.redirect('/login', 200, {
                        error: true,
                        msg: 'Vous devez vous (re)connecter !'
                    });
                } else {
                    console.log("user groups : " + decoded._doc.groupe);
                    // if everything is good, save to request for use in other routes

                    if (typeof (decoded._doc.groupe) !== 'undefined') {
                        if (groupe.indexOf(decoded._doc.groupe) > -1) {
                            req.decoded = decoded;
                            next();
                        } else {
                            res.redirect('/erreur', 403, {
                                error: true,
                                msg: "Vous n'avez pas les droits !"
                            });
                        }
                    } else {
                        res.redirect('/erreur', 403, {
                            error: true,
                            msg: "Vous n'avez pas les droits !"
                        });
                    }
                }
            });
        } else {

            res.redirect('/login', 200, {error: true, msg: 'Vous devez vous (re)connecter !'});
        }
    };
}

module.exports = checkToken;
