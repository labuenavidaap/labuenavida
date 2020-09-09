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
mongoose.set('useFindAndModify', false)

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
  Cart.findOne({ product: req.params.id })
    .then(cart => {
      if (cart) {
        Cart.findByIdAndUpdate(cart.id, { $inc: { quantity: req.body.quantity || 1 } })
          .then(() => res.redirect(`/products/${req.params.id}`))
          .catch(err => console.log(err))
      } else {
        const cartData = {}
        cartData.quantity = req.body.quantity || 1
        cartData.product = req.params.id
        cartData.user = req.currentUser.id

        const newCart = new Cart(cartData)
        newCart.save()
          .then(() => res.redirect('/products'))
          .catch(err => console.log(err))
      }
    })
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
      if (user.cart.length) {
        let finalCartPrice = user.cart.reduce((accum, current) => {
          return accum + Number(current.product.price) * current.quantity
        }, 0).toFixed(2)

        res.render('cart/confirm', { user, cart: user.cart, finalCartPrice })
      } else {
        res.render(`cart/cart`, { user: req.currentUser.id, message: 'You must add at least one product to continue' })
      }
    })
}

module.exports.addToWishList = (req, res, next) => {
  WishList.findOne({ product: req.params.id})
    .then(wlist => {
      if (wlist) {
        return
      } else {
        const wishListData = {}
        wishListData.product = req.params.id
        wishListData.user = req.currentUser.id

        const wishList = new WishList(wishListData)
        wishList.save()
          .then(() => res.redirect(`/products`))
          .catch(err => console.log(err))
      }
    })
}

module.exports.removeFromWishList = (req, res, next) => {
  WishList.findByIdAndDelete(req.params.id)
    .then(p => res.redirect(`/users/${req.currentUser.id}`))
    .catch(err => console.log(err))
}


module.exports.stripe = (req, res, next) => {
  User.findById(req.currentUser.id)
    .populate({
      path: 'cart',
      populate: {
        path: 'product'
      }
    })
    .then(user => {
      if (user.address && user.phone) {
        let finalCartPrice = user.cart.reduce((accum, current) => {
          return accum + Number(current.product.price) * current.quantity
        }, 0).toFixed(2)
        const orderData = {
          user: user.id,
          product: user.cart,
          total: finalCartPrice,
        }
        const order = new Order(orderData)
        return order
          .save()
          .then(order => {
            const session = stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [
                {
                  price_data: {
                    currency: 'EUR',
                    product_data: {
                      name: 'La Buena Vida',
                    },
                    unit_amount: (order.total * 100).toFixed(0),
                  },
                  quantity: 1,
                },
              ],
              mode: 'payment',
              success_url: `http://localhost:3000/thank-you/${req.currentUser.id}`,
              cancel_url: 'https://example.com/cancel',
            })
              .then(session => {
                res.json({ id: session.id })
              })
          })
          .catch(err => console.log(err))
      } else {
        res.redirect(`/confirm-order/${user.id}`)
      }
    })
    .catch(error => next(error))
}

module.exports.renderThankYou = (req, res, next) => {
  res.render('cart/thankyou', { user: req.currentUser, avoidCart: true })
}

module.exports.thankYouRedirect = (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: 'order',
      options: { sort: { 'createdAt': -1 } }
    })
    .populate('cart')
    .then(user => {
      mailer.sendOrder({
        name: user.name,
        email: user.email,
        id: user.id,
        order: user.order[0].total
      })
      const reduceStock = user.cart.map(cart => {
        return Product.findByIdAndUpdate(cart.product, { $inc: { stock: -cart.quantity } })
      })

      const deleteCart = Cart.deleteMany({ user: user.id })
      Promise.all([...reduceStock, deleteCart])
        .then(() => res.redirect('/products'))
        .catch(err => console.error(err))
    })
}

