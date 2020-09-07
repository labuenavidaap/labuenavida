const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Product = require('./product.model')
const Comment = require('./comment.model')
const Cart = require('./cart.model')
const WishList = require('./wishlist.model')
const Order = require('./order.model')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let token = ''
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)]
    }
    return token
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [EMAIL_PATTERN, 'Please fill a valid email address'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            minlength: [5, 'The min length is five characters'],
        },
        social: {
            googleId: String,
            facebookId: String
        },
        phone: {
            type: String,
            minlength: [9, 'The min length is nine numbers'],
            maxlength: [15, 'The max length is fifteen numbers'],
        },
        address: {
            type: String,
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
        // Producer:
        producer: {
            type: Boolean,
            default: false
        },
        companyName: {
            type: String
        },
        compAddress: {
            type: String
        },
        compMail: {
            type: String
        },
        compPhone: {
            type: String
        },
        compLink: {
            type: String
        },
        bio: {
            type: String
        },
        certificates: {
            type: String
        },
        logo: {
            type: String
        },
        pictures: {
            type: String
        },
        politic: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'producer',
    justOne: false
})

userSchema.virtual('wishList', {
    ref: 'WishList',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

userSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

userSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash
            next()
        })
    } else {
        next()
    }
})

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User