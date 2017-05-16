function checkPassword() {
    return function (req, res, next) {

        var password = req.body.password;

        if (password && password.length > 7) {

            var hasUpperCase = /[A-Z]/.test(password);
            var hasLowerCase = /[a-z]/.test(password);
            var hasNumbers = /\d/.test(password);
            var hasNonalphas = /\W/.test(password);

            if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas === 4) {
                req.checkPassword = password;
                //req.user = { pseudo: req.body.email, password: req.body.password };
                console.log('true');

                next();

            } else {

                req.checkPassword = false;

                res.status(401).json({
                    error: true,
                    message: 'Le mot de passe ne respecte pas la complexité.',
                    alert: 'warning'
                });
                res.send();
            }
        } else {

            req.checkPassword = false;

            res.status(401).json({
                error: true,
                message: 'Le mot de passe doit avoir 8 caractères minimum.',
                alert: 'warning'
            });
            res.send();

        }
    };
}

module.exports = checkPassword;
