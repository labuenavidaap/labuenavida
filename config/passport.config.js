  
const passport = require("passport");
const User = require("../models/user.model");
const Strategy = require("passport-slack/lib/passport-slack/strategy");
const SlackStrategy = require("passport-slack").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const slack = new SlackStrategy(
  {
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackUrl: "/auth/slack",
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.slack": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            username: profile.user.email.split("@")[0],
            email: profile.user.email,
            avatar: profile.user.image_1024,
            password:
              profile.provider + Math.random().toString(36).substring(7),
            social: {
              slack: profile.id,
            },
            activation: {
                active: true
            }
          });

          newUser
            .save()
            .then((user) => {
              next(null, user);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
);

passport.use(slack)

const googleClient = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;


const google =  new GoogleStrategy(
    {
      clientID: googleClient,
      clientSecret: googleSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);
 
      User.findOne({ "social.googleID": profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          } else {
            const newUser = new User({
              name: profile._json.name,
              username: profile._json.given_name,
              email: profile._json.email,
              avatar: profile._json.picture,
              password:
                profile._json.sub + Math.random().toString(36).substring(7),
              social: {
                googleID: profile.id,
              },
              activation: {
                  active: true
              }
            });
            newUser
            .save()
            .then((user) => {
              done(null, user);
            })
            .catch((err) => done(err));
          }
 
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )

  passport.serializeUser(function(user, next) {
    next(null, user);
  });
  passport.deserializeUser(function(user, next) {
    next(null, user);
  });
  
passport.use(google)

module.exports = passport.initialize()