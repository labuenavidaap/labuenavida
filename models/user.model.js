const Product = require('./product.model')
const Comment = require('./comment.model')
const Rate = require('./rate.model')
const Cart = require('./cart.model')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

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
            minlength: [5, 'minlength five characters'],
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
        bougthProducts: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Cart'
        },
        wishList: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Product'
        },
        producer: {
            type: Boolean,
            default: false
        },

        // here starts producer properties:
        
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

// here virtual
userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'producer',
    justOne: false
})
// here virtual

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash;
        next();
      });
    } else {
      next();
    }
  })

userSchema.methods.checkPassword = function (password) {
return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema)
module.exports = User