const mongoose = require('mongoose')
const User = require('../models/user.model')
const mailer = require('../config/mailer.config')
const passport = require('passport')

module.exports.login = (req, res, next) => {
    res.render('users/login');
  }

// Controller to social login  Google (passport)

module.exports.doSocialLoginGoogle = (req, res, next) => {
    const passportControllerGoogle = passport.authenticate('google', {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    })
  
    passportControllerGoogle(req, res, next)
  }
  
  
  // Controller to callback login  Google (passport)
  
  module.exports.googleCallback = (req, res, next) => {
    const googleCallback = passport.authenticate("google",  (error, user) => {
      if (error) {
        next(error)
      } else {
        req.session.userId = user.id
        res.redirect("/projects")
      }
    })

    googleCallback(req, res, next);
  }