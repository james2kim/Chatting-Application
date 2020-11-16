const express = require('express');
const multer = require('multer') 
const sharp = require ('sharp')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = new express.Router();
const mongoose = require('mongoose');
const fs = require('fs')
const path = require ('path')
const defaultImageURL = path.join(__dirname + '/../assets/user.jpg')


// Route Handler to get all user objects except for ones own. This is ultimately for the users list. 
router.get('/users', auth, async (req,res) => {

    try {
        let id = mongoose.Types.ObjectId(req.user._id)
        const users = await User.aggregate()
            .match({ _id: { $not: { $eq: id } } })
            .project({
                password: 0,
                __v: 0
            })
           

            res.send(users)
            
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }

})


// Route Handler to Sign Up for Account. This handler will create a user in DB, add a default profile photo buffer to this User Schema
router.post('/users', async(req,res) => {
        const user = new User(req.body)
        user.avatar= fs.readFileSync(defaultImageURL)
    try {

        const ifUser = await User.findOne({email:req.body.email})
     
        if (ifUser) return res.send('Account Registered')
    
        await user.save()
        const token = await user.generateAuthToken()
        let u  = await User.findOne({email: req.body.email})
        await User.findByIdAndUpdate(u._id, {image: `/users/${u._id}/avatar`})
        res.status(201).send({user,token})
    } catch (err) {
        res.status(400).send(err)
    }
})



// Route Handler to Login to Acount.
router.post('/users/login', async (req, res) => {
    const io = req.app.get('socketio')
    try {
        await User.findOneAndUpdate({email: req.body.email}, {date: Date.now()})
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (err) {
        res.status(400).send()
    }
})

// Route Handler to Logout of Account. This removes all JSON web tokens from the user. 
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

// Route Handler to update account information. 
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOp = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOp) return res.status(400).send({error: 'Invalid Updates'})

    try {
        await User.findOneAndUpdate({email: req.body.email}, {date: Date.now()})
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch(err) {
        res.status(400).send(err)
    }
})

// Route Handler to get specific User by ID
router.get('/users/:id', auth, async (req ,res) => {
    let userID = req.params.id
        try {
            const user = await User.findById(userID)
            res.send(user.data)
        } catch (err) {
            console.log(err)
        }
})

// Utilized Multer for File uploads. Criteria for photo type is made in fileFilter method. 
const upload = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req,file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('The file must be a .jpg, .jpeg, or .png'))
        } 
        cb(undefined, true)

    }
})

// Route Handler to add new photo buffer to database. 
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        await User.findOneAndUpdate({email: req.body.email}, {date: Date.now()})
        const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.json(buffer)
    } catch (error) {
        res.status(400).send({error:error.message})
    }

})


// Route Handler to GET photo for specific user. 
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) return
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

module.exports = router


