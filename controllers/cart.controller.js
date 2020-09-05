const mongoose = require('mongoose')
const User = require('../models/user.model')
const Cart = require('../models/cart.model')
const Order = require('../models/order.model')
const Product = require('../models/product.model')
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
      let finalCartPrice = user.cart.reduce((accum, current) => {
        return accum + Number(current.product.price) * current.quantity 
      }, 0).toFixed(2)
      
      res.render('cart/cart', { user, cart: user.cart, finalCartPrice}) 
    })
    
}

module.exports.addToCart = (req, res, next) => {
    const cartData = {}
    cartData.quantity = req.body.quantity
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

// module.exports.renderConfirmOrder = (req, res, next) => {

// }

// module.exports.payment = (req, res, next) => {
  
// }