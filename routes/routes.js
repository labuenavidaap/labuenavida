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
router.get('/', (req, res) => res.render('home'))
// router.get('/auth/google', session.isNotAuthenticated, usersController.doSocialLoginGoogle)
// router.get('/auth/google/callback', session.isNotAuthenticated, usersController.googleCallback)

module.exports = router