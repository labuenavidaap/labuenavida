const express = require('express')
const router = express.Router()
const session = require('../middlewares/session.middleware')
const projectsMiddleware = require('../middlewares/project.middleware')
const projectsController = require('../controllers/projects.controller')
const usersController = require('../controllers/user.controller')
const commentsController = require('../controllers/comments.controller')
const upload = require('../config/multer.config')

// routes

module.exports = router