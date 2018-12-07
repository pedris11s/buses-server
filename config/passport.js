// var FacebookStrategy = require('passport-facebook').Strategy,
//   TwitterStrategy = require('passport-twitter').Strategy,
//   GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
//   LocalStrategy = require('passport-local').Strategy,
//   bcrypt = require('bcryptjs'),
//   jwt = require('jsonwebtoken');
//
//
// export const facebookStrategy = new FacebookStrategy({
//     clientID: "2066949536651355",
//     clientSecret: "63b11591804554a3e180478efe80fb04",
//     callbackURL: "http://localhost:1337/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'photos', 'email'],
//     enableProof: true
//   },
//   function(req, accessToken, refreshToken, profile, done) {
//     User.findOne({uid: profile.id}, function(err, user) {
//       if (user) {
//         return done(null, user);
//       } else {
//
//         var data = {
//           provider: profile.provider,
//           uid: profile.id,
//           name: profile.displayName,
//         };
//
//         if (profile.emails && profile.emails[0] && profile.emails[0].value) {
//           data.email = profile.emails[0].value;
//         }
//         if (profile.name && profile.name.givenName) {
//           data.name = profile.name.givenName;
//           data.username = profile.name.givenName;
//         }
//         if (profile.name && profile.name.familyName) {
//           data.lastName = profile.name.familyName;
//         }
//
//         User.create(data, function(err, user) {
//           return done(err, user);
//         });
//       }
//     });
//     done(profile);
//   }
// );
//
// export const googleStrategy = new GoogleStrategy({
//     clientID: "1062493286078-2v4kp8lg1cis7u2u36uqa3qgk018duuv.apps.googleusercontent.com",
//     clientSecret: "UlJj7Ipd2hxn53urOXOoHpi5",
//     callbackURL: 'http://localhost:1337/auth/google/callback'
// },
//   function(req, accessToken, refreshToken, profile, done) {
//     User.findOne({uid: profile.id}, function(err, user) {
//       if (user) {
//         return done(null, user);
//       } else {
//
//         var data = {
//           provider: profile.provider,
//           uid: profile.id,
//           name: profile.displayName,
//         };
//
//         if (profile.emails && profile.emails[0] && profile.emails[0].value) {
//           data.email = profile.emails[0].value;
//         }
//         if (profile.name && profile.name.givenName) {
//           data.name = profile.name.givenName;
//           data.username = profile.name.givenName;
//         }
//         if (profile.name && profile.name.familyName) {
//           data.lastName = profile.name.familyName;
//         }
//
//         User.create(data, function(err, user) {
//           return done(err, user);
//         });
//       }
//     });
//     done(profile);
//   }
// );
//
// export const twitterStrategy = new TwitterStrategy({
//     consumerKey: 'F0hCOJBMChSPHqi4YtKJ2HwmJ',
//     consumerSecret: 'BIvC1lHUx7CjREXcCCEB6er4FxIMvmToMZxCOBqjM2CPZDM0JM',
//     callbackURL: 'http://localhost:1337/auth/twitter/callback',
//     includeEmail:true
//   },
//   function(req, token, tokenSecret, profile, done) {
//
//     User.findOne({uid: profile.id}, function(err, user) {
//       if (user) {
//         return done(null, user);
//       } else {
//
//         var data = {
//           provider: profile.provider,
//           uid: profile.id,
//           name: profile.displayName,
//         };
//
//         if (profile.emails && profile.emails[0] && profile.emails[0].value) {
//           data.email = profile.emails[0].value;
//         }
//         if (profile.name && profile.name.givenName) {
//           data.name = profile.name.givenName;
//           data.username = profile.name.givenName;
//         }
//         if (profile.name && profile.name.familyName) {
//           data.lastName = profile.name.familyName;
//         }
//
//         User.create(data, function(err, user) {
//           return done(err, user);
//         });
//       }
//     });
//   }
// );
//
// export const localStrategy = new LocalStrategy({
//   usernameField: 'username',
//   passportField: 'password'
// }, function (username, password, cb) {
//   User.findOne({username}).populate('roles')
//     .then((user) => {
//       if (!user) return cb(null, false, {message: 'Username not found'});
//
//       bcrypt.compare(password, user.password, (err, res) => {
//         if (!res) return cb(null, false, {message: 'Invalid Password'});
//
//         user['autologinToken'] = jwt.sign(
//           {id: user.id},
//           sails.config.globals.genTokenForAutologin,
//           {expiresIn: '367d'});
//
//         let userDetails = sails.services.repository.user.cleanUser(user);
//         return cb(null, userDetails, {message: 'Login Succesful'});
//       })
//     })
// });
