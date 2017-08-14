var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:{ type:String, lowercase:true,required:[true,"Name is required"],unique:true,validate:{
		validator:(name)=> name.length > 2,
		message:"Name must be longer than 2 character" 
	}},
	password:{type:String},
	email:{type:String,required:true,lowercase:true,unique:true},
	social:{
		provider:String,
		name:String,
		name:String,
		social_id:String
	}
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