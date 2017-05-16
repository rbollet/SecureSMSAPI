/* Please configure /private/configDB */
var mongoose = require('../private/configDB');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', function(error){
   console.log('**** WARNING ! Impossible de se connecter à la base ! ****') ;
   console.log(error);
});

db.on('open', function(){
   console.log('Connexion à la base réussie !') ;   
});

var Schema = mongoose.Schema;

var contactSchema = new Schema({
    pseudo: {type: String, required: "Le pseudo est obligatoire !"},    

});

// Create a model using userSchema
var User = mongoose.model('Contact', contactSchema);

// make this available to our users in our Node applications
module.exports = User;
