var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var session = require("express-session");
var passport = require('passport');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require("./models/user");
var request = require("request");
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ================ MONGOOSE SETUP ===============

mongoose.connect("mongodb://127.0.0.1/mean_full",(err)=>{
	if(err){
		console.log(err);
	}else{
		console.log("Database connected");
	}
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true,cookie: { secure: false } }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log("From serialize");
    console.log(user);
   var tok = jwt.sign(user, 'secret', { expiresIn: '1h' });
   token = "JWT " +tok;  

    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// ============= CORS ==============
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "content-Type,Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// ====================	 passport-jwt =====================

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	console.log("from jwt");console.log(jwt_payload);
    User.findById({_id: jwt_payload._doc._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account 
        }
    });
}));

// ================== 	passport facebook ================
 FacebookStrategy = require('passport-facebook').Strategy;
 passport.use(new FacebookStrategy({
     clientID: "726688227533356",
     clientSecret: "b23bc3ed7fe0b5080a20279b53a4ac29",
     callbackURL: "http://localhost:3000/auth/facebook/callback",
     profileFields: ['id', 'displayName', 'emails']
 }, function(accessToken, refreshToken, profile,done) {
      console.log(accessToken);
     User.findOne({ email: profile._json.email }, (err, user) => {
         if (err) {
             done(err);
         }
        
        if(user){
          
            return done(null,user);
           
            }
            else {
                console.log("creating new user");
                var user = new User({
                    username: profile._json.name,
                    email: profile._json.email
                });
                user.save((err, user) => {
                    if (err) {
                        done(err);
                    } else {

                        return done(null, user);
                    }
                });
            }
            });
            // done(null, user);
            }));

app.use('/', index);
app.use('/users', users);


// =============================    ROUTES ==================
app.post('/register', (req, res) => {
            var newUser = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            };

            User.create(newUser, (err, user) => {
                if (err) {
                    console.log(err);
                    res.json({
                        success: false,
                        msg: err.message
                    });
                } else {
                    bcrypt.hash(user.password, 10, function(err, hash) {
                        if (err) {
                            console.log(err);
                        } else {
                            user.password = hash;
                            user.save();
                        }
                    });
                    res.json({
                        success: true,
                        msg: "user created successfuly"
                    });
                }
            });
});

app.post("/login",(req,res)=>{
	let oldUser = {
		username:req.body.username,
		password:req.body.password
	};
    console.log(req.session);
	User.findOne({username:oldUser.username},(err,user)=>{
		if(err){
			res.json({
				success:false,
				msg:err.message
			});
		}else{
		
			if(user){
				bcrypt.compare(oldUser.password, user.password, function(err, foundUser) {
    		if(err){
    			res.json({
    				success:false,
    				msg:err.message
    			});
    		}else{
                 req.login(user,(err,loged)=>{
                    console.log("logged");
                 });
              
    			
    			if(foundUser){
    				var token = jwt.sign(user, opts.secretOrKey, { expiresIn: '1h' });
    				res.json({
    				success:true,
    				msg:"You are now loged in",
    				user:{
    					username:user.username,
    					email:user.email,
    					token:"JWT "+token
    				}
    			});
    			}else{
    				res.json({
    				success:false,
    				msg:"password do not match"
    			});
    			}
    		}
			});
			}else{

			res.json({
				success:false,
				msg:"Username does not exist"
			});
		}
		}
	});
});

app.get('/profile', passport.authenticate('jwt', { session: false}),
    function(req, res) {
      res.json({
      	success:true,
      	msg:"Welcome to profile",
        user:{
            name:req.user.username,
            email:req.user.email
        }
      });
    }
);

app.get('/auth/facebook', passport.authenticate('facebook', {scope:"email"}),(req,res)=>{

});
app.get('/auth/facebook/callback', passport.authenticate('facebook', 
{failureRedirect: '/login' }),(req,res)=>{

  res.redirect("http://localhost:4200/home/"+token);
});

app.get("/social",(req,res)=>{
   if(req.isAuthenticated()){
    res.send(req.user);

   }else{
    res.json({
        success:false
    })
   }
});




app.listen(3000,()=>{
	console.log("App started at port 3000");
});

module.exports = app;


// User.find({},(err,user)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(user);
// 	}
// });
// User.remove({},(err,user)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("user removed");
// 	}
// });