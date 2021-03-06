const express = require('express')
const router = express.Router()
const upload = require('../config/multer.config.js')
const cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'pictures', maxCount: 1 }])
const sessionMiddleware = require('../middlewares/session.middleware')
const productMiddleware = require('../middlewares/product.middleware')
const cartMiddleware = require('../middlewares/cart.middleware')
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const cartController = require('../controllers/cart.controller')
const commentController = require('../controllers/comment.controller')

router.get('/', (req, res) => res.redirect('/home'))

router.get('/login', sessionMiddleware.noAuthenticated, userController.renderLogin)
router.get('/auth/google', sessionMiddleware.noAuthenticated, userController.doSocialLoginGoogle)
router.get('/auth/google/callback', sessionMiddleware.noAuthenticated, userController.googleCallback)
router.post('/login', sessionMiddleware.noAuthenticated, userController.login)
router.get('/user/signup', sessionMiddleware.noAuthenticated, userController.renderSignup)
router.post('/signup', sessionMiddleware.noAuthenticated, userController.signup)
router.get('/users/:id/activate/:token', sessionMiddleware.noAuthenticated, userController.activateUser)
router.get('/users/:id', sessionMiddleware.authenticated, cartMiddleware.itemsInCart, userController.renderProfile)
router.get('/become-producer/:id', sessionMiddleware.authenticated, userController.becomeProducer)
router.get('/producer-profile/:id', sessionMiddleware.couldBeAuthenticated, userController.renderPublicProfile)
router.get('/users/:id/edit', sessionMiddleware.authenticated, cartMiddleware.itemsInCart, userController.renderEditUser)
router.post('/users/:id/edit', sessionMiddleware.authenticated, cpUpload, userController.editUser)
router.post('/users/:id/edit-profile', sessionMiddleware.authenticated, userController.editNormalUser)
router.post('/users/:id/delete', sessionMiddleware.authenticated, userController.deleteUser)
router.post('/logout', sessionMiddleware.authenticated, userController.logout)

router.get('/home', sessionMiddleware.couldBeAuthenticated, cartMiddleware.itemsInCart, productController.renderHome)
router.get('/products', sessionMiddleware.couldBeAuthenticated, cartMiddleware.itemsInCart, productController.renderAllProducts)
router.get('/products/:id', sessionMiddleware.couldBeAuthenticated, cartMiddleware.itemsInCart, productController.renderOneProduct)
router.get('/new-product', sessionMiddleware.authenticated, productController.renderCreateForm)
router.post('/new-product', sessionMiddleware.authenticated, upload.single('image'), productController.createProduct)
router.get('/products/:id/edit', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.renderEditForm)
router.post('/products/:id/edit', sessionMiddleware.authenticated, productMiddleware.productOwner, upload.single('image'), productController.editProduct)
router.post('/delete/:id', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.deleteProduct)

router.post('/new-comment/:id', sessionMiddleware.authenticated, upload.single('photo'), commentController.newComment)

router.get('/users/:id/cart', sessionMiddleware.authenticated, cartMiddleware.itemsInCart, cartController.renderCart)
router.post('/product/:id/cart', sessionMiddleware.authenticated, cartController.addToCart)
router.post('/product/:id/cart/delete', sessionMiddleware.authenticated, cartController.removeFromCart)
router.get('/confirm-order/:id', sessionMiddleware.authenticated, cartMiddleware.itemsInCart, cartController.renderConfirmOrder)
router.post('/product/:id/wishlist', sessionMiddleware.authenticated, cartController.addToWishList)
router.post('/product/:id/wishlist/delete', sessionMiddleware.authenticated, cartController.removeFromWishList)
router.post('/create-checkout-session', sessionMiddleware.authenticated, cartController.stripe)
router.get('/thank-you/:id', sessionMiddleware.authenticated, cartMiddleware.itemsInCart, cartController.renderThankYou)
router.post('/thank-you/:id', sessionMiddleware.authenticated, cartMiddleware.itemsInCart, cartController.thankYouRedirect)

module.exports = router
