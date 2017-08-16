// sendgrid api key: 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


var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:{ type:String, lowercase:true,required:[true,"Name is required"],unique:true,validate:{
		validator:(name)=> name.length > 2,
		message:"Name must be longer than 2 character" 
	}},
	password:{
		type:String,required:true,validate:{
			validator:(password)=> password.length >= 4,
			message:"password must be morethan 3 letters"
		}
	},
	email:{type:String,required:true,lowercase:true,unique:true},
	social:{
		provider:String,
		social_id:String,
		gender:String,
		image:String
	},
	temporarytoken:{type:String},
	active:{type:Boolean,default:false}
});


// UserSchema.pre("save",function(next){
// 	var user = this;
// 	bcrypt.hash(user.password, 10, function(err, hash) {
// 		if(err){
// 			console.log(err);
// 		}else{
// 			user.password = hash;
// 			next();
// 		}
// 	});
	
// });
var User = mongoose.model("User",UserSchema);

module.exports = User;