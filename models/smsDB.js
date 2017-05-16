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

var smsSchema = new Schema({
    sms: {type: String, required: "Le sms est obligatoire"},
    created_at: { type : Date, default : Date.now },
    expire_at: { type : Date, required: false },
    time: { type : Number, required: false },
    etat: { type : Boolean, default : false },
    from: {type : mongoose.Schema.Types.ObjectId, ref : "User", required: "l'expéditeur est obligatoire"},
    to: {type : mongoose.Schema.Types.ObjectId, ref : "User", required: "le correspondant est obligatoire"},
    room: [{type : mongoose.Schema.Types.ObjectId, ref : "Room", required: false }]   
 
});

var Sms = mongoose.model('Sms', SmsSchema);

module.exports = Sms;
