const mongoose = require('mongoose')
const User = require('../models/user.model')
const Cart = require('../models/cart.model')
const mailer = require('../config/mailer.config')
const passport = require('passport')

module.exports.renderCart = (req, res, next) => {
    User.findById(req.params.id)
    .populate({
      path: 'cart',
      populate: {
        path: 'product'
      }
    })
    .populate({
      path: 'cart',
      populate: {
        path: 'user'
      }
    })
    .then(user => {
      res.render('cart/cart', { user, cart: user.cart }) 
    })  
}

module.exports.addToCart = (req, res, next) => {
    const cartData = {}
    console.log(req.params.id);
    cartData.product = req.params.id
    cartData.user = req.currentUser.id

    const cart = new Cart(cartData)

    cart.save()
    .then(() => res.redirect('/products'))
    .catch(err => console.log(err))
}

module.exports.removeFromCart = (req, res, next) => {
  Cart.findByIdAndDelete(req.params.id)
  .then(p => res.redirect(`/users/${req.currentUser.id}/cart`))
  .catch(err => console.log(err))
}