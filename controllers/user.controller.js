const mongoose = require('mongoose')
const mailer = require('../config/mailer.config')
const passport = require('passport')
const User = require('../models/user.model')

module.exports.renderLogin = (req, res, next) => {
  res.render('user/login')
}

module.exports.doSocialLoginGoogle = (req, res, next) => {
  const passportControllerGoogle = passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
  passportControllerGoogle(req, res, next)
}

module.exports.googleCallback = (req, res, next) => {
  const googleCallback = passport.authenticate('google', (error, user) => {
    if (error) {
      next(error)
    } else {
      req.session.userId = user.id
      User.findById(req.session.userId)
        .then(user => {
          if (!user.address) {
            res.redirect('/home')
          } else {
            res.redirect('/home')
          }
        })
    }
  })
  googleCallback(req, res, next)
}

module.exports.userFromGoogle = (req, res, next) => {
  res.render('home', { currentUser: req.currentUser })
}

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
    .catch(err => console.log(err))
}

module.exports.renderSignup = (req, res, next) => {
  res.render('user/new')
}

module.exports.signup = (req, res, next) => {
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
        res.render('user/new', { error: error.errors, user })
      } else if (error.code === 11000) {
        res.render('user/new', {
          user,
          error: {
            email: {
              message: 'User already exists'
            }
          }
        })
      } else {
        next(error)
      }
    })
    .catch(err => console.log(err))
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({ _id: req.params.id, 'activation.token': req.params.token })
    .then(user => {
      if (user) {
        user.activation.active = true
        user.save()
          .then(() => {
            res.render('user/login', {
              message: 'Your account has been activated, log in below!'
            })
          })
          .catch(err => console.log(err))
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
    .catch(err => console.log(err))
}

module.exports.renderProfile = (req, res, next) => {
  if (req.currentUser.producer) {
    User.findById(req.params.id)
      .populate('products')
      .then(user => {
        res.render('user/show', { user })
      })
      .catch(err => console.log(err))
  } else {
    User.findById(req.params.id)
      .populate({
        path: 'wishList',
        populate: {
          path: 'product'
        }
      })
      .populate({
        path: 'wishList',
        populate: {
          path: 'user'
        }
      })
      .populate({
        path: 'order',
        populate: {
          path: 'product'
        }
      })
      .then(user => {
        res.render('user/show', { user, wishList: user.wishList })
      })
  }
}

module.exports.becomeProducer = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.params.id }, { runValidators: true, new: true })
    .then(user => {
      if (user) {
        res.render('user/edit', { user })
      }
      return user
    })
    .then(user => {
      user.producer = true
      user.save()
    })
    .catch(err => console.log(err))
}

module.exports.renderPublicProfile = (req, res, next) => {
  User.findById(req.params.id)
    .populate('products')
    .then(user => {
      res.render('user/show-public', { user })
    })
    .catch(err => console.log(err))
}

module.exports.renderEditUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.render('user/edit', { user })
    })
    .catch(next)
}

module.exports.editUser = (req, res, next) => {
  const body = req.body

  if ((req.files.logo && req.files.pictures) && req.currentUser.producer) {
    body.logo = req.files.logo[0].path
    body.pictures = req.files.pictures[0].path
  }

  User.findOneAndUpdate({ _id: req.params.id }, body, { runValidators: true, new: true })
    .then(user => {
      res.redirect(`/users/${req.params.id}`)
    })
    .catch(err => {
      console.log(err)
      res.render('user/edit', { user: req.currentUser, 
        error: err.errors
      })
    })
}

module.exports.deleteUser = (req, res, next) => {
  if (req.params.id.toString() === req.currentUser.id.toString()) {
    req.currentUser.remove()
      .then(() => {
        req.session.destroy()
        res.redirect('/home')
      })
      .catch(next)
  } else {
    res.redirect('/home')
  }
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
}