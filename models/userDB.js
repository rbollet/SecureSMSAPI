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

var userSchema = new Schema({
    uid: String,
    password: {type: String, required: "Le mot de passe est obligatoire"},
    created_at: { type : Date, default : Date.now },
    updated_at: { type : Date, default : Date.now },
    last_connection_at: { type : Date, default : Date.now },
    contacts: [{type : mongoose.Schema.Types.ObjectId, ref : "User", required: false}]
    
    //resultatsEvaluations : [{ type : mongoose.Schema.Types.ObjectId, ref : "EvaluationApprenant", required: false}],
});

// Create a model using userSchema
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
