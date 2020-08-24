const Product = require("./product.model")
const Comment = require("./comment.model")
const Rate = require("./rate.model")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
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

    // here starts producer properties:
    
    companyName: {
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

const User = mongoose.model('User', userSchema);
module.exports = User;