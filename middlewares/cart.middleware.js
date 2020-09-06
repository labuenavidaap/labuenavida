const User = require('../models/user.model')

module.exports.itemsInCart = (req, res, next) => {
  User.findById(req.session.userId)
    .populate('cart')
    .then(user => {
      if (user) {
        res.locals.numProducts = user.cart.length
      } else {
        res.locals.numProducts = 0
      }
      next()
    })
    .catch(e => next(e))
}