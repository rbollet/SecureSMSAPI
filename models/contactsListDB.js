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

var contactsListSchema = new Schema({
    created_at: { type : Date, default : Date.now },
    updated_at: { type : Date, default : Date.now },
    belongUser: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },  
    contacts: [ {
            pseudo: String,
            contact: {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
                required: false
            },
            required: false
        }]
});

// Create a model using userSchema
var ContactsList = mongoose.model('ContactsList', contactsListSchema);

// make this available to our users in our Node applications
module.exports = ContactsList;