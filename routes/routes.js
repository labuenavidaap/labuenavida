const express = require('express')
const router = express.Router()
const sessionMiddleware = require('../middlewares/session.middleware')
const productMiddleware = require('../middlewares/product.middleware')
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const commentController = require('../controllers/comment.controller')
const cartController = require('../controllers/cart.controller')
const rateController = require('../controllers/rate.controller')
const upload = require('../config/multer.config')


// routes
router.get('/', (req, res) => res.redirect('/home'))

// PRODUCT ROUTES

// router.get('/home', productController.renderHome)
// router.get('/products', productController.renderAll)
// router.get('/products/:id', productController.renderProduct)
// router.get('/products/:id/edit', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.renderEditForm)
// router.post('/product/:id/edit', sessionMiddleware.authenticated, productMiddleware.productOwner, fileUploader.single('image'), productController.edit)
// router.get('/new-product', sessionMiddleware.authenticated, productController.renderCreateForm)
// router.post('/new-product', sessionMiddleware.authenticated, fileUploader.single('image'), productController.createProduct)
// router.post('/new-comment/:id', sessionMiddleware.authenticated, commentController.newComment)
// router.post('/products/:id/rate', sessionMiddleware.authenticated, rateController)
// router.post('/delete/:id', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.deleteProduct)


// CART & WISHLIST ROUTES

// router.get('/profile/:id/cart', sessionMiddleware.authenticated, cartController.renderCart)
// router.post('/product/:id/cart', sessionMiddleware.authenticated, cartController.addToCart)
// router.post('/product/:id/cart/delete', sessionMiddleware.authenticated, cartController.removeFromCart)
// router.get('/confirm-order/:id', sessionMiddleware.authenticated,cartController.renderConfirmOrder)
// Payment With Stripe
// router.get('/thank-you', sessionMiddleware.authenticated,)

// router.get('/profile/:id/wishlist', sessionMiddleware.authenticated, userController.renderWishList)
// router.post('/product/:id/wishlist', sessionMiddleware.authenticated, productController.addToWishList)
// router.post('/product/:id/wishlist/delete', sessionMiddleware.authenticated, productController.removeFromWishList)



// USER ROUTES

router.get('/login', sessionMiddleware.noAuthenticated, userController.renderLogin)
router.post('/login', sessionMiddleware.noAuthenticated, userController.login)
router.post('/logout', sessionMiddleware.authenticated, userController.logout)
router.get('/auth/google', sessionMiddleware.noAuthenticated, userController.doSocialLoginGoogle)
router.get('/auth/google/callback', sessionMiddleware.noAuthenticated, userController.googleCallback)
router.get('/user/new', sessionMiddleware.noAuthenticated, userController.renderSignup)
router.post('/users', sessionMiddleware.noAuthenticated /*fileUploader.single('avatar')*/, userController.create)
router.get('/activate/:token',sessionMiddleware.noAuthenticated, userController.activateUser)
// router.get('/user/:id', sessionMiddleware.authenticated, userController.show)
// router.get('/profile/:id/edit', sessionMiddleware.authenticated, userController.renderEditProfile)
// router.post('/profile/:id/edit', sessionMiddleware.authenticated, fileUploader.single('avatar'), userController.editProfile)



// router.get('/logout', sessionMiddleware.authenticated, userController.logout)


module.exports = router