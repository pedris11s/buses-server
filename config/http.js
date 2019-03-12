// noinspection JSUnresolvedFunction
/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
// import {localStrategy} from "./passport";

module.exports.http = {

  /****************************************************************************
   *                                                                           *
   * Express middleware to use for every Sails request. To add custom          *
   * middleware to the mix, add a function to the middleware config object and *
   * add its key to the "order" array. The $custom key is reserved for         *
   * backwards-compatibility with Sails v0.9.x apps that use the               *
   * `customMiddleware` config option.                                         *
   *                                                                           *
   ****************************************************************************/

  middleware: {

    passportInit: (function () {
      let passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy,
        TwitterStrategy = require('passport-twitter').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        LocalStrategy = require('passport-local').Strategy,
        bcrypt = require('bcryptjs'),
        jwt = require('jsonwebtoken');

      passport.use(new LocalStrategy({
        usernameField: 'username',
        passportField: 'password'
      }, (username, password, cb) => {
        User.findOne({username})
          .then((user) => {
            if (!user) return cb(null, false, {message: 'Username not found'});

            bcrypt.compare(password, user.password, (err, res) => {
              if (!res) return cb(null, false, {message: 'Invalid Password'});

              user['autologinToken'] = jwt.sign(
                {id: user.id},
                sails.config.globals.genTokenForAutologin,
                {expiresIn: '367d'});

              let userDetails = sails.services.repository.user.cleanUser(user);
              return cb(null, userDetails, {message: 'Login Succesful'});
            });
          });
      }));
      passport.use(new FacebookStrategy({
        clientID: '2066949536651355',
        clientSecret: '63b11591804554a3e180478efe80fb04',
        callbackURL: 'https://www.kimirik.com/auth/facebook/callback',
        profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
        enableProof: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        User.findOne({uid: profile.id})
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              let data = {
                provider: profile.provider,
                uid: profile.id,
                name: profile.displayName
              };

              if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                let email = profile.emails[0].value;
                data.email = email;
                data.username = email.substring(0, email.indexOf('@'));
              }
              if (profile.name && profile.name.givenName) {
                data.name = profile.name.givenName;
              }
              if (profile.name && profile.name.familyName) {
                data.lastName = profile.name.familyName;
              }

              sails.services.repository.user.createUser(data)
                .then((user) => {
                  return done(null, user);
                })
                .catch((err) => done(err, null));
            }
          });
        // done(profile);
      }
      ));
      passport.use(new GoogleStrategy({
        clientID: '1062493286078-2v4kp8lg1cis7u2u36uqa3qgk018duuv.apps.googleusercontent.com',
        clientSecret: 'iqfMb8nZFcZ8QRCMcfApwtAf',
        callbackURL: 'https://www.kimirik.com/auth/google/callback'
      },
      (req, accessToken, refreshToken, profile, done) => {
        User.findOne({uid: profile.id})
          .then((user) => {
	    console.log('buscando usuario', user);
            if (user) {
              return done(null, user);
            } else {
              let data = {
                provider: profile.provider,
                uid: profile.id,
                name: profile.displayName
              };

              if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                let email = profile.emails[0].value;
                data.email = email;
                data.username = email.substring(0, email.indexOf('@'));
                console.log('usuario', data);
              }
              if (profile.name && profile.name.givenName) {
                data.name = profile.name.givenName;
              }
              if (profile.name && profile.name.familyName) {
                data.lastName = profile.name.familyName;
              }
              console.log('datos para crear user', data);
              sails.services.repository.user.createUser(data)
                .then((user) => {
                  return done(null, user);
                })
                .catch((err) => done(err, null));
            }
          });
        done(profile);
      }
      ));
      passport.use(new TwitterStrategy({
        consumerKey: 'SGYRryWDyCKyFm2dfRZ3YGG4M',
        consumerSecret: '0wjPPDOCTyYZNu9PXIfsY2H9ite8Bv21f1kRHYI5iME7Wkr8pE ',
        callbackURL: 'http://www.wankar.com/auth/twitter/callback',
        includeEmail: true
      },
      (req, token, tokenSecret, profile, done) => {
        console.log('profile', profile);

        User.findOne({uid: profile.id})
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              const fullName = profile.displayName.split(' ');
              const sizeName = fullName.length;
              let data = {
                provider: profile.provider,
                uid: profile.id,
                username: profile.username ? profile.username : '',
                name: profile.displayName ? fullName[0] : '',
                lastName: sizeName > 2 ? fullName[sizeName - 2] + ' ' + fullName[sizeName - 1] : sizeName > 1 ? fullName[sizeName - 1] : ''
              };

              if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                let email = profile.emails[0].value;
                data.email = email;
                if (data.username.length === 0) { data.username = email.substring(0, email.indexOf('@')); }
                console.log('usuario', data);
              }

              sails.services.repository.user.createUser(data)
                .then((user) => {
                  return done(null, user);
                })
                .catch((err) => done(err, null));
            }
          });
      }
      ));

      let reqResNextFn = passport.initialize();
      return reqResNextFn;
    })(),

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'passportInit',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ]

    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }

    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     * Note that Sails uses an internal instance of Skipper by default; to      *
     * override it and specify more options, make sure to "npm install skipper" *
     * in your project first.  You can also specify a different body parser or  *
     * a custom function with req, res and next parameters (just like any other *
     * middleware function).                                                    *
     *                                                                          *
     ***************************************************************************/

    // bodyParser: require('skipper')({strict: true})

  }

  /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

  // cache: 31557600000
};
