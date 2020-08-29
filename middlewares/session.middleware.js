const User = require('../models/user.model')

module.exports.authenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch(next)
}

module.exports.noAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        res.redirect('/')
      } else {
        next()
      }
    })
    .catch(next)
}

module.exports.couldBeAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        next()
      }
    })
    .catch(next)
}