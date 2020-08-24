const Product = require('../models/product.model')

module.exports.productOwner = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product.producer.toString() === req.currentUser.id.toString()) {
        req.product = product
        next()
      } else {
        res.redirect(`/products/${req.params.id}`)
      }
    })
    .catch(next)
}