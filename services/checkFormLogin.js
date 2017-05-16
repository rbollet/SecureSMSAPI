function checkFormLogin() {
    return function (req, res, next) {

        console.log('uid : ' + req.body.uid);
        console.log('password : ' + req.body.password);

        if (req.body.uid && req.body.password && req.body.password.length > 7) {

            //req.user = { pseudo: req.body.email, password: req.body.password };
            req.checkFormLogin = true;

            console.log('true');

            next();
        } else {
            /*res.status(400).json({
             success: false,
             message: 'Vos paramètres sont incorrectes !'
             });
             res.send();*/

            req.checkFormLogin = false;

            next();
        }
    };
}

module.exports = checkFormLogin;
