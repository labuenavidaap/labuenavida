const express = require('express')
const router = express.Router()
const sessionMiddleware = require('../middlewares/session.middleware')
const productMiddleware = require('../middlewares/product.middleware')
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const commentController = require('../controllers/comment.controller')
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
// router.post('/products/:id/like', sessionMiddleware.authenticated, commentController.like)
// router.post('/delete/:id', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.deleteProduct)
// router.post('/product/:id/cart', sessionMiddleware.authenticated, productController.addToCart)
// router.post('/product/:id/wishlist', sessionMiddleware.authenticated, productController.addToWishList)

// USER ROUTES

// router.get('/login', sessionMiddleware.noAuthenticated, userController.renderLogin)
// router.post('/login', sessionMiddleware.noAuthenticated, userController.Login)
// router.get('/auth/google', session.noAuthenticated, usersController.doSocialLoginGoogle)
// router.get('/auth/google/callback', session.notAuthenticated, usersController.googleCallback)
// router.get('/signup', sessionMiddleware.noAuthenticated, userController.renderSignup)
// router.post('/signup', sessionMiddleware.noAuthenticated, fileUploader.single('avatar'), userController.signup)
// router.get('/activate/:token', userController.activate)
// router.get('/profile/:id', sessionMiddleware.authenticated, userController.renderProfile)
// router.get('/profile/:id/edit', sessionMiddleware.authenticated, userController.renderEditProfile)
// router.post('/profile/:id/edit', sessionMiddleware.authenticated, fileUploader.single('avatar'), userController.editProfile)
// router.get('/profile/:id/wishlist', sessionMiddleware.authenticated, userController.renderWishList)
// router.get('/profile/:id/cart', sessionMiddleware.authenticated, userController.renderCart)
// Payment With Stripe

// router.get('/logout', sessionMiddleware.authenticated, userController.logout)


module.exports = router