const Product = require('../models/product.model')
const User = require('../models/user.model')
const Comment = require('../models/comment.model')
const rate = require('../models/rate.model')

module.exports.renderHome = (req, res, next) => {
    if (req.currentUser) {
        res.render('products/home', req.currentUser)
    } else {
        res.render('products/home')
    }
    
}

module.exports.renderAll = (req, res, next) => {
  const criteria = {}

  if (req.query.search) {
    res.locals.search = req.query.search
    criteria['$or'] = [
      { name: new RegExp(req.query.search, "i") },
      { ['title']: new RegExp(req.query.search, "i") },
    ]
  }

  Product.find(criteria)
    .sort({createdAt: -1})
    .populate('user')
    .populate('comments')
    .populate('rates')
    .then(products => {
      res.render('products/all-products', { products, current: req.currentUser })
    })
    .catch(next)
}

module.exports.renderProduct= (req, res, next) => {

  Product.findById(req.params.id)
  .populate('user')
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
    res.render('products/product', {
      product,
      current: req.currentUser
    })
  })
  .catch(next)
}

module.exports.renderEditForm = (req, res, next) => {
  Product.findById(req.params.id)
  .then(product => {
    res.render('products/product-edit', {product, current: req.currentUser})
  }) 
}

module.exports.editProduct = (req, res, next) => {
  const {name, description, price, categories, producer,stock} = req.body
  const image = req.file ? req.file.path : null
  Product.findByIdAndUpdate(req.params.id, {name, description, image, price, categories, producer,stock}, { new: true })
  .then(() => res.redirect(`/profile/${req.currentUser._id}`))
  .catch(e => console.log(e))
}

module.exports.renderCreateForm = (req, res, next) => {
  res.render('products/new-product')
}

module.exports.createProduct = (req, res) => {
  const productData = req.body
  productData.user = req.currentUser._id
  productData.image = req.file ? req.file.path : null
  const project = new Product (productData)

  product.save()
  .then(() => res.redirect(`/products`))
  .catch(err => console.log(err))
}

module.exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/products'))
  .catch(e => console.log(e))
}