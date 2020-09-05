const mongoose = require('mongoose')
const User = require('../models/user.model')
const WishList = require('../models/wishlist.model')
const mailer = require('../config/mailer.config')
const passport = require('passport')

module.exports.renderLogin = (req, res, next) => {
  res.render('user/login')
}

// Controller to social login  Google (passport)
module.exports.doSocialLoginGoogle = (req, res, next) => {
  const passportControllerGoogle = passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
  passportControllerGoogle(req, res, next)
}

// Controller to callback login  Google (passport)
module.exports.googleCallback = (req, res, next) => {
  const googleCallback = passport.authenticate('google', (error, user) => {
    if (error) {
      next(error)
    } else {
      req.session.userId = user.id
      User.findById(req.session.userId)
        .then(user => {
          if (!user.address) {
            res.redirect('/user-from-google')
          } else {
            res.redirect('/home')
          }
        })
    }
  })
  googleCallback(req, res, next)
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
    .catch(e => next(e))
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
        res.render('user/new', { error: error.errors, user })
      } else if (error.code === 11000) { // error when duplicated user
        res.render('user/new', {
          user,
          error: {
            email: {
              message: 'user already exists'
            }
          }
        })
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
        user.activation.active = true
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
  if (req.currentUser.producer) {
  User.findById(req.params.id)
  .populate( 'products' )
  .then(user => {
    res.render('user/show', { user }) 
  })
  .catch(e => next(e))
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

// Controller to edit user
module.exports.editUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.render('user/edit', { user })
    })
    .catch(next)
}

// Controller to update user
module.exports.updateProfile = (req, res, next) => {
  const body = req.body
  if ((req.files.logo && req.files.pictures) && req.currentUser.producer) {
    body.logo = req.files.logo[0].path
    body.pictures = req.files.pictures[0].path
  }
  User.findOneAndUpdate({ _id: req.params.id }, body, { runValidators: true, new: true })
    .then(user => {
      res.redirect('/home')
    })
    .catch(next)
}

// Controller to delete user
module.exports.delete = (req, res, next) => {
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

// Controller to become a producer
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
    .catch(e => next(e))
}

module.exports.addToWishList = (req, res, next) => {
  const wishListData = {}
  wishListData.product = req.params.id
  wishListData.user = req.currentUser.id

  const wishList = new WishList(wishListData)

  wishList.save()
  .then(() => res.redirect(`/products`))
  .catch(err => console.log(err))
}

module.exports.removeFromWishList = (req, res, next) => {
  WishList.findByIdAndDelete(req.params.id)
  .then(p => res.redirect(`/users/${req.currentUser.id}`))
  .catch(err => console.log(err))
}

module.exports.removeFromWishList = (req, res, next) => {
  WishList.findByIdAndDelete(req.params.id)
  .then(p => res.redirect(`/users/${req.currentUser.id}`))
  .catch(err => console.log(err))
}

module.exports.renderPublicProfile= (req, res, next) => {
  User.findById(req.params.id)
  .populate( 'products' )
  .then(user => {
    res.render('user/public-profile', { user }) 
  })
  .catch(e => next(e))
}