var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var session = require("express-session");
var qs = require('querystring');
var passport = require('passport');
var request = require('request');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require("./models/user");
var request = require("request");
var index = require('./routes/index');
var users = require('./routes/users');
var xoauth2 = require("xoauth2");
var app = express();
/*
|-------------------------------------------------------------
|  MONGOOSE CONFIG
|-------------------------------------------------------------
*/


mongoose.connect("mongodb://127.0.0.1/mean_full", (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected");
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: { secure: false } }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
|-------------------------------------------------------------
|  PASSPORT CONFIG
|-------------------------------------------------------------
*/


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    // generate token for social user
    var tok = jwt.sign(user, 'secret', { expiresIn: '1h' });
    token = "JWT " + tok;

    done(null, user.id);
});

passport.deserializeUser(function(id, done) {

    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/*
|-------------------------------------------------------------
|  CORS
|-------------------------------------------------------------
*/

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "content-Type,Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});



/*
|-------------------------------------------------------------
|   NODE MAILER & sendGrid
|-------------------------------------------------------------
*/


var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
   service: 'Gmail',
    auth: {
        user:"uzzolmean@gmail.com",
        pass:"08520280"

        // xoauth2:xoauth2.createXOAuth2Generator({
        //      user: 'uzzolmean@gmail.com',
        // clientID:" 903525597572-po5cf8a20cri0g3ult77a958rha4t40o.apps.googleusercontent.com ",
        // clientSecret:" mWWTKD7cIFy0leszVGx8w69D",
        // refreshToken:"1/MtZzqcUnb3bmzDEgv3TPk5TTf-PqeBXw5Lz8qAOx6I0" 
        // })
      }
});
/*
|-------------------------------------------------------------
|   PASSPORT JWT
|-------------------------------------------------------------
*/

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById({ _id: jwt_payload._doc._id }, function(err, user) {
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

/*
|-------------------------------------------------------------
|   LOGIN WITH FACEBOOK
|-------------------------------------------------------------
*/

FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: "726688227533356",
    clientSecret: "b23bc3ed7fe0b5080a20279b53a4ac29",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) {
            done(err);
        }

        if (user) {

            return done(null, user);

        } else {
       
             var user = new User({
                   username: profile._json.name,
                email: profile._json.email
                   
                });
                 user.social.provider=profile.provider;
                   user.social.social_id=profile.id;
                   




            user.save({ validateBeforeSave: false },(err, user) => {
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

/*
|-------------------------------------------------------------
|   LOGIN WITH TWITTER
|-------------------------------------------------------------
*/
TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
        consumerKey: "LsA52qkjgoqE1r5ubpoX3OwEK",
        consumerSecret: "zqFGKvUz5EyzhYeemnn4D0XFcKEGrKjnyR1FydulnaI8UkX4xn",
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
        // importat for getting user email
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
    function(token, tokenSecret, profile, done) {
        console.log(profile);
        User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) {
                done(err);
            }

            if (user) {

                return done(null, user);

            } else {
        
                 var user = new User({
                    username: profile._json.name,
                    email: profile.emails[0].value
                   
                });
                 user.social.provider=profile.provider;
                   user.social.social_id=profile.id;
                   user.social.image = profile.photos[0].value;



                user.save({validateBeforeSave:false},(err, user) => {
                    if (err) {
                        done(err);
                    } else {

                        return done(null, user);
                    }
                });
            }
        });
    }
));




/*
|-------------------------------------------------------------
|   LOGIN WITH GOOGLE
|-------------------------------------------------------------
*/
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
        clientID: "451074809708-ov6sjl996fibp5mi40tete8ashprhl16.apps.googleusercontent.com",
        clientSecret: "4ebFxk40kVTz_KcwqnW5xnfT",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
       
        User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) {
                done(err);
            }

            if (user) {

                return done(null, user);

            } else {
                console.log("creating new user");
                var user = new User({
                    username: profile.name.givenName,
                    email: profile.emails[0].value
                   
                });
                 user.social.provider=profile.provider;
                    user.social.gender=profile.gender;
                   user.social.social_id=profile.id;
                   user.social.image = profile._json.image.url;
                user.save({ validateBeforeSave: false },(err, user) => {
                    if (err) {
                        done(err);
                    } else {

                        return done(null, user);
                    }
                });
            }
        });
    }
));



/*
|-------------------------------------------------------------
|   ROUTES
|-------------------------------------------------------------
*/


app.use('/', index);
app.use('/users', users);


/*
|-------------------------------------------------------------
|  ROUTES
|-------------------------------------------------------------
*/

// User.remove({},(err,user)=>{
//  if(err){
//      console.log(err);
//  }else{
//      console.log("user removed");
//  }
// });

app.post('/register', (req, res) => {
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email


    };
    var token = jwt.sign({ name: newUser.username, email: newUser.email }, opts.secretOrKey, { expiresIn: '24h' });
    newUser.temporarytoken = token;

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



            let mailOptions = {
                from: '"localhost" <uzzolmean@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Hello ', // Subject line
                text: 'Hello world ?', // plain text body
                html: 'Hello<strong>' + user.username + '</strong> thank you for registering in my app <br/> please click on the following link for account activation <a href=http://localhost:4200/activate/' + user.temporarytoken + '>Activate your account</a>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

            res.json({
                success: true,
                msg: "Account created! please check your email for activation link"
            });
        }
    });
});


/*
|-------------------------------------------------------------
|  resend activation token
|-------------------------------------------------------------
*/
// if user does not receive the email send first time from registration 
app.put("/resend",(req,res)=>{
    // ask for email to make sure user is correct 
    User.findOne({email:req.body.email},(err,user)=>{
        if(err){
             res.json({
                success:false,
                msg:err.message
            });
        }else if(user.temporarytoken === "false"){
            // 
            res.json({
                success:false,
                msg:"Your account is already activated"
            });
        } else{

            let mailOptions = {
                from: '"localhost" <uzzolmean@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Hello ', // Subject line
                text: 'Hello world ?', // plain text body
                html: 'Hello<strong>' + user.username + '</strong> thank you for registering in my app <br/> please click on the following link for account activation <a href=http://localhost:4200/activate/' + user.temporarytoken + '>Activate your account</a>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.json({
                    success:true,
                    msg:"Activatin link resend please check your eamil"
                })
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

        }
    });

});



app.post("/login", (req, res) => {
    let oldUser = {
        username: req.body.username,
        password: req.body.password
        

    };
    
    User.findOne({ username: oldUser.username }, (err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: err.message
            });
        } else {


            if (!user.active) {
                res.json({
                    success:undefined,
                    msg:"You need to activate your account first"
                });
            
            } else if(user) {

                bcrypt.compare(oldUser.password, user.password, function(err, foundUser) {
                    if (err) {
                        res.json({
                            success: false,
                            msg: err.message
                        });
                    } else {
                        console.log(foundUser);
                        
                        if (foundUser) {
                            var token = jwt.sign(user, opts.secretOrKey, { expiresIn: '24h' });
                            res.json({
                                success: true,
                                msg: "You are now loged in",
                                user: {
                                    username: user.username,
                                    email: user.email,
                                    token: "JWT " + token
                                }
                            });

                        } else {
                            res.json({
                                success: false,
                                msg: "password do not match"
                            });
                        }
                    }
                });

               
            }else{
                 res.json({
                    success: false,
                    msg: "Username does not exist"
                });
            }
        }
    });
});

// only accessable if user is logged in so here req.user is available
app.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.json({
            success: true,
            msg: "Welcome to profile",
            user: req.user
        });
    }
);


// activate token which send to user email
app.put("/activate/:token", (req, res) => {
   
    User.findOne({ temporarytoken: req.params.token }, (err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: "something went srong in jwt verify method"
            });
        } 

        var token = req.params.token;
        jwt.verify(token,opts.secretOrKey,(err,decoded)=>{
            if(err){
                res.json({
                success: false,
                msg: "Invalid token"
            });
            }else if(!user){
                 res.json({
                success: false,
                msg: "token expired"
            });

            }else{
                 user.temporarytoken = "false";
                user.active = true;
                user.save();
                 res.json({
                success: true,
                msg: "Your account activated! Please log in now"
            });
            }
        });
    });
});

/*
|-------------------------------------------------------------
|  SOCIAL LOGIN AREA
|-------------------------------------------------------------
*/


app.get('/auth/facebook', passport.authenticate('facebook', { scope: "email" }), (req, res) => {

});
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:4200/home/" + token);
});


app.get('/auth/twitter',
    passport.authenticate('twitter'), (req, res) => {

    });

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("http://localhost:4200/home/" + token);
    });

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', "email"] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("http://localhost:4200/home/" + token);
    });


/*
|-------------------------------------------------------------
|   APP LISTENING PORT
|-------------------------------------------------------------
*/


app.listen(3000, () => {
    console.log("App started at port 3000");
});

module.exports = app;


// User.find({},(err,user)=>{
//  if(err){
//      console.log(err);
//  }else{
//      console.log(user);
//  }
// });
// User.remove({},(err,user)=>{
//  if(err){
//      console.log(err);
//  }else{
//      console.log("user removed");
//  }
// });