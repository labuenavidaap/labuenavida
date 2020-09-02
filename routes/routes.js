const express = require('express')
const router = express.Router()
const sessionMiddleware = require('../middlewares/session.middleware')
const productMiddleware = require('../middlewares/product.middleware')
const productController = require('../controllers/product.controller')
const userController = require('../controllers/user.controller')
const commentController = require('../controllers/comment.controller')
const cartController = require('../controllers/cart.controller')
const upload = require('../config/multer.config.js')
const cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'pictures', maxCount: 1 }])


// routes
router.get('/', (req, res) => res.redirect('/home'))

// PRODUCT ROUTES

router.get('/home', sessionMiddleware.couldBeAuthenticated, productController.renderHome)
router.get('/products', sessionMiddleware.couldBeAuthenticated, productController.renderAll)
router.get('/products/:id', sessionMiddleware.couldBeAuthenticated, productController.renderProduct)
router.get('/products/:id/edit', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.renderEditForm)
router.post('/products/:id/edit', sessionMiddleware.authenticated, productMiddleware.productOwner, upload.single('image'), productController.editProduct)
router.get('/new-product', sessionMiddleware.authenticated, productController.renderCreateForm)
router.post('/new-product', sessionMiddleware.authenticated, upload.single('image'), productController.createProduct)
router.post('/new-comment/:id', sessionMiddleware.authenticated, upload.single('photo'), commentController.newComment)
router.post('/delete/:id', sessionMiddleware.authenticated, productMiddleware.productOwner, productController.deleteProduct)


// CART & WISHLIST ROUTES

router.get('/users/:id/cart', sessionMiddleware.authenticated, cartController.renderCart)
router.post('/product/:id/cart', sessionMiddleware.authenticated, cartController.addToCart)
// router.post('/product/:id/cart/delete', sessionMiddleware.authenticated, cartController.removeFromCart)
// router.get('/confirm-order/:id', sessionMiddleware.authenticated,cartController.renderConfirmOrder)
// Payment With Stripe
// router.get('/thank-you', sessionMiddleware.authenticated,)

router.post('/product/:id/wishlist', sessionMiddleware.authenticated, userController.addToWishList)
// router.post('/product/:id/wishlist/delete', sessionMiddleware.authenticated, productController.removeFromWishList)



// USER ROUTES

router.get('/login', sessionMiddleware.noAuthenticated, userController.renderLogin)
router.post('/login', sessionMiddleware.noAuthenticated, userController.login)
router.post('/logout', sessionMiddleware.authenticated, userController.logout)
router.get('/auth/google', sessionMiddleware.noAuthenticated, userController.doSocialLoginGoogle)
router.get('/auth/google/callback', sessionMiddleware.noAuthenticated, userController.googleCallback)
router.get('/user-from-google',sessionMiddleware.authenticated, userController.userFromGoogle)
router.get('/user/signup', sessionMiddleware.noAuthenticated, userController.renderSignup)
router.post('/signup', sessionMiddleware.noAuthenticated /*fileUploader.single('avatar')*/, userController.create)
router.get('/users/:id/activate/:token',sessionMiddleware.noAuthenticated, userController.activateUser)
router.get('/users/:id', sessionMiddleware.authenticated, userController.showProfile)
router.get('/users/:id/edit', sessionMiddleware.authenticated, userController.editUser)
router.post('/users/:id/edit', sessionMiddleware.authenticated, cpUpload, userController.updateProfile)
router.get('/become-producer/:id', sessionMiddleware.authenticated, userController.becomeProducer)
router.post('/users/:id/delete', sessionMiddleware.authenticated, userController.delete)


module.exports = router