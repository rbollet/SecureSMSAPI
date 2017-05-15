/**
 * checkToken vérifie si l'user authentifié
 *
 */

var jwt = require('jsonwebtoken');
var Cookies = require("cookies");


function checkToken() {
    return function (req, res, next) {
        req.decoded = false;
        // check header or url parameters or post parameters for token
        // Pour l'authentification pour l'application mobile
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // Pour l'authentification par cookie
        if (!token) {
            var token = new Cookies(req, res).get('access_token');
        }

        console.log(token);


        if (typeof (token) !== 'undefined') {

            // verifies secret and checks exp
            jwt.verify(token, req.app.get('config').secret, function (err, decoded) {
                if (err) {
                    req.decoded = false;
                    next();


                } else {
                   
                    console.log(decoded);
                    req.decoded = decoded;
                    next();


                }
            });
        } else {
            req.decoded = false;
            next();

        }
    };
}

module.exports = checkToken;
