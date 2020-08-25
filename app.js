require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport.config')
require('./config/db.config')
require('./config/hbs.config')
const session = require('./config/session.config')
const app = express()

app.use(express.urlencoded({ extended: false })) 
app.use(express.static(path.join(__dirname, 'public'))) 
app.use(logger('dev'))
app.use(cookieParser()) 
app.use(session) 
app.use(passport)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

const router = require('./routes/routes.js')
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log('Connected to', process.env.PORT)
})