  
const passport = require('passport')
const User = require('../models/user.model')
const GoogleStrategy = require('passport-google-oauth20').Strategy


const googleClient = process.env.GOOGLE_CLIENT_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET


const google =  new GoogleStrategy(
    {
      clientID: googleClient,
      clientSecret: googleSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      
      User.findOne({ 'social.googleId': profile.id })
        .then(user => {
          if (user) {
            done(null, user)
            return
          } else {
            const newUser = new User({
              name: profile._json.name,
              email: profile._json.email,
              password: profile._json.sub + Math.random().toString(36).substring(7),
              social: {
                googleId: profile.id,
              },
              activation: {
                  active: true
              }
            })
            newUser
            .save()
            .then((user) => {
              done(null, user)
            })
            .catch((err) => done(err))
          }
 
        })
        .catch(err => done(err))
    }
  )

  passport.serializeUser(function(user, next) {
    next(null, user)
  })
  passport.deserializeUser(function(user, next) {
    next(null, user)
  })
  
passport.use(google)

module.exports = passport.initialize()