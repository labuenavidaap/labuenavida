const mongoose = require('mongoose')
const User = require('../models/user.model')
const mailer = require('../config/mailer.config')
const passport = require('passport')

module.exports.renderLogin = (req, res, next) => {
    res.render('user/login')
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
        User.findById(req.session.userId)
        .then(user => {
          if(!user.address) {
            res.redirect('/user-from-google')
          } else {
            res.redirect('/home')
          }
          
        })
      }
    })

    googleCallback(req, res, next);
  }

  // Controller from user from google

  module.exports.userFromGoogle = (req, res, next) => {
    res.render('user/user-from-google', { currentUser: req.currentUser })
  }

  // Controller to post login

  module.exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          user.checkPassword(req.body.password)
            .then(match => {
              if (match) {
                if (user.activation.active) {
                  req.session.userId = user._id
                  res.redirect('/home')
                } else {
                  res.render('user/login', {
                    error: {
                      validation: {
                        message: 'Your account is not active, check your email!'
                      }
                    }
                  })
                }
              } else {
                res.render('user/login', {
                  error: {
                    email: {
                      message: 'Sorry, User not found'
                    }
                  }
                })
              }
            })
        } else {
          res.render('user/login', {
            error: {
              email: {
                message: 'Sorry, User not found'
              }
            }
          })
        }
      })
      .catch(next(e))
  }

// Controller to logout user

module.exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}

  // Controller to user/new view (signup)

module.exports.renderSignup = (req, res, next) => {
  res.render('user/new')
}

 // Controller to post new user

 module.exports.create = (req, res, next) => {
  const user = new User({
    ...req.body,
    avatar: req.file ? req.file.path : undefined
  })

  user.save()
    .then(user => {
      mailer.sendValidationEmail({
        name: user.name,
        email: user.email,
        id: user._id.toString(),
        activationToken: user.activation.token
      })
      
      res.render('user/login', {
        message: 'Check your email for activation'
      })
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("user/new", { error: error.errors, user });
      } else if (error.code === 11000) { // error when duplicated user
        res.render("user/new", {
          user,
          error: {
            email: {
              message: 'user already exists'
            }
          }
        });
      } else {
        next(error)
      }
    })
    .catch(e => next(e))
}

// Controller to activate user. Set user.activate to true

module.exports.activateUser = (req, res, next) => {
  User.findOne({ _id: req.params.id, 'activation.token': req.params.token })
    .then(user => {
      if (user) {
        user.activation.active = true;
        user.save()
          .then(() => {
            res.render('user/login', {
              message: 'Your account has been activated, log in below!'
            })
          })
          .catch(e => next(e))
      } else {
        res.render('user/login', {
          error: {
            validation: {
              message: 'Invalid link'
            }
          }
        })
      }
    })
    .catch(e => next(e))
}

// Controller to show profile

module.exports.showProfile = (req, res, next) => {
  User.findById(req.params.id)
    // .populate({
    //   path: "projects",
    //   populate: "staff"
    // })
    // .populate({
    //   path: "staffProjects",
    //   populate: "author"
    // })
    .then(user => {
      res.render('user/show', { user })
    })
    .catch(e => next(e))
};

// Controller to update user

module.exports.updateProfile = (req, res, next) => {
  const body = req.body
  User.findOneAndUpdate( { _id: req.params.id}, body, { runValidators: true, new: true })
    .then(user => {
      if (user) {
        res.render(`user/edit`, { user })
      } else {
        res.redirect('/home')
      }
    })
    .catch(next)
}

// Controller to delete user

module.exports.delete = (req, res, next) => {
  if (req.params.id.toString() === req.currentUser.id.toString()) {
    req.currentUser.remove()
      .then(() => {
        req.session.destroy()
        res.redirect("/login")
      })
      .catch(next)
  } else {
    res.redirect('/home')
  }
}