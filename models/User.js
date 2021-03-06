const mongoose = require ('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim:true
    },
    password: {
        type:String,
        required:true,
        trim:true,
        minlength:6,

        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('The Password cannot contain "password" ')
            }
        }
    },

    email: {
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid')
            }
        }
    },
    date: {
        type:Number,
        default:Date.now
    },
    tokens: [{
        token: {
            type:String,
            required:true
        }
    }],
    avatar: {
        type:Buffer
    },
    image: {
        type:String
    }
})


userSchema.methods.toJSON= function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}




userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user._id.toString() }, process.env.JWT_SECRET)
    console.log(token)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    
    if (!user) throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Unable to login')
    
    return user
}

// Hash the plain text password before saving 
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})



const User = mongoose.model('User', userSchema)

module.exports = User