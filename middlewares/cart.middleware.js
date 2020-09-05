const User = require('../models/user.model')

module.exports.itemsInCart = (req, res, next) => {
    console.log(req.session)
  User.findById(req.session.userId)
  .populate('cart')
    .then(user => {
        res.locals.numProducts = user.cart.length 
        console.log(res.locals.numProducts)
        next()
    })
    .catch(e => next(e))
}