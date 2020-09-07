const mongoose = require('mongoose')
const mailer = require('../config/mailer.config')
const passport = require('passport')
const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(secretKey)
const Cart = require('../models/cart.model')
const WishList = require('../models/wishlist.model')
const User = require('../models/user.model')
const Order = require('../models/order.model')
const Product = require('../models/product.model')

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

      res.render('cart/cart', { user, cart: user.cart, finalCartPrice })
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

module.exports.renderConfirmOrder = (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: 'cart',
      populate: {
        path: 'product'
      }
    })
    .then(user => {
      let finalCartPrice = user.cart.reduce((accum, current) => {
        return accum + Number(current.product.price) * current.quantity
      }, 0).toFixed(2)

      res.render('cart/confirm', { user, cart: user.cart, finalCartPrice })
    })
}

module.exports.payment = (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: 'cart',
      populate: {
        path: 'product'
      }
    })
    .then(user => {
      if (user.address && user.phone) {
        if (user) {
          let finalCartPrice = user.cart.reduce((accum, current) => {
            return accum + Number(current.product.price) * current.quantity
          }, 0).toFixed(2)
  
          stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
          })
            .then(costumer => {
              stripe.charges.create({
                amount: finalCartPrice,
                description: `Buy: ${user.name}`,
                currency: 'EUR',
                customer: costumer.id
              })
            })
            .then(charge => {
              const orderData = {
                user: req.params.id,
                product: user.cart,
                total: finalCartPrice,
              }
              const order = new Order(orderData)
              return order
                .save()
                .then(() => {
                  Cart.deleteMany({ user: user.id })
                    .then(res.redirect(`/thank-you/${user.id}`))
                })
            })
        }
      } else {
        res.redirect(`/confirm-order/${user.id}`)
      }
    })
    .catch(error => next(error))
}

module.exports.renderThankYou = (req, res, next) => {
  res.render('cart/thankyou', { user: req.currentUser })
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