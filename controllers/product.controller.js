const mongoose = require('mongoose')
const Product = require('../models/product.model')
const User = require('../models/user.model')
const Comment = require('../models/comment.model')

module.exports.renderHome = (req, res, next) => {
  Product.find()
    .populate('producer')
    .populate('comments')
    .then(products => {
      const productRate = products.map(product => {
        if (product.comments.length != 0) {
          product.averageRate = (product.comments.reduce((accum, current) => {
            return current.rate + accum
          }, 0) / product.comments.length).toFixed(1)
        } else { product.averageRate = 0 }
        return product
      }).sort((a, b) => b.averageRate - a.averageRate).slice(0, 3)
      res.render('product/home', { currentUser: req.currentUser, products: productRate })
    })
}

module.exports.renderAllProducts = (req, res, next) => {
  const criteria = {}

  if (req.query.search) {
    res.locals.search = req.query.search
    criteria['$or'] = [
      { name: new RegExp(req.query.search, 'i') },
      { ['title']: new RegExp(req.query.search, 'i') },
    ]
  }

  Product.find(criteria)
    .sort({ createdAt: -1 })
    .populate('producer')
    .populate('comments')
    .then(products => {
      res.render('product/show-all', { products, currentUser: req.currentUser })
    })
    .catch(next)
}

module.exports.renderOneProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .populate('producer')
    .populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: 'user'
    })
    .then(product => {
      let averageRate = 0
      if (product.comments.length != 0) {
        product.averageRate = (product.comments.reduce((accum, current) => {
          return current.rate + accum
        }, 0) / product.comments.length).toFixed(1)
      }

      res.render('product/show', { product, currentUser: req.currentUser })
    })
    .catch(next)
}

module.exports.renderCreateForm = (req, res, next) => {
  res.render('product/new', { currentUser: req.currentUser })
}

module.exports.createProduct = (req, res) => {
  const productData = req.body
  productData.producer = req.currentUser._id
  productData.price = Number(req.body.price).toFixed(2).toString()
  productData.image = req.file ? req.file.path : null
  const product = new Product(productData)

  product.save()
    .then(() => res.redirect(`/products`))
    .catch(err => {
      res.render('product/new', {
        product,
        error: err.errors
      })
    })
}

module.exports.renderEditForm = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      res.render('product/edit', { product, currentUser: req.currentUser })
    })
    .catch(err => console.log(err))
}

module.exports.editProduct = (req, res, next) => {
  const body = req.body
  body.image = req.file ? req.file.path : null
  body.producer = req.currentUser.id

  Product.findOneAndUpdate({ _id: req.params.id }, body, { runValidators: true, new: true })
    .then(product => {
      res.redirect(`/users/${req.currentUser.id}`)
      return product
    })
    .catch(err => {
      Product.findById(req.params.id)
        .then(product => {
          res.render('product/edit', {
            product,
            error: err.errors
          })
        })
        .catch(err => console.log(err))
    })
}

module.exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndRemove(req.params.id)
    .then(() => res.redirect(`/users/${req.currentUser.id}`))
    .catch(err => console.log(err))
}