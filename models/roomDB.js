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

var roomSchema = new Schema({
    uid: {type: String, required: true },
    created_at: { type : Date, default : Date.now },
    updated_at: { type : Date, default : Date.now },
    from: {type : mongoose.Schema.Types.ObjectId, ref : "User", required: true },
    to: {type : mongoose.Schema.Types.ObjectId, ref : "User", required: true },
    sms: [{type : mongoose.Schema.Types.ObjectId, ref : "Sms", required: false }]        
});

// Create a model using userSchema
var Room = mongoose.model('Room', roomSchema);

// make this available to our users in our Node applications
module.exports = Room;
