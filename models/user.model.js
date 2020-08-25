const Product = require('./product.model')
const Comment = require('./comment.model')
const Rate = require('./rate.model')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  return token
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: [5, 'minlength five characters'],
        maxlength: [15, 'maxlength fifteen characters'],
        required: [true, 'Password is required']
    },
    social: {
        googleId: String,
        facebookId: String
    },
    phone: {
        type: String
    },
    address: {
        type: String,
        required: [true, 'Address is required to send your products!']
    },
    activation: {
        active: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            default: generateRandomToken
        }
    },
    producer: {
        type: Boolean,
        default: false
    },
    cart: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    bougthProducts: {
        type: [mongoose.Schema.Types.ObjectId]
    },

    // here starts producer properties:
    
    companyName: {
        type: String,
        required: [true, 'Company name is required']
    },
    compAddress: {
        type: String,
        required: [true, 'Company address is required']
    },
    compMail: {
        type: String,
        required: [true, 'Company mail is required']
    },
    compPhone: {
        type: String,
        required: [true, 'Company phone is required']
    },
    compLink: {
        type: String
    },
    bio: {
        type: String
    },
    certificates: {
        type: [String]
    }, 
    logo: {
        type: String
    },
    pictures: {
        type: [String]
    },
    politic: {
        type: Boolean,
        default: false
    },

    
})

const User = mongoose.model('User', userSchema)
module.exports = User