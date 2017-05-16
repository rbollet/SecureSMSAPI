var User = require('../models/userDB');

/**
 * Permet de retrouver un contact
 * Return user trouvé
 * @returns {Function}
 */
function checkContact() {
    return function (req, res, next) {
        
        var uid = req.body.uid;
        
        console.log('uid' + uid);
        
        User.findOne({
            uid: uid
        }, function (err, user) {

            if (!user) {

                res.status(404).json({
                    error: false,
                    msg: 'Contact non trouvé !',
                    alert: 'info',
                    code: 1
                });

            } else {

                req.contact = user;
                
                next();
            }
        });

    };
}

module.exports = checkContact;
