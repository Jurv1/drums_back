import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import * as UserController from './controlers/UserController.js'
import * as PostController from './controlers/PostController.js'

import checkAuth from './utils/checkAuth.js'
import handleErr from './utils/handleErr.js'


mongoose.connect('mongodb+srv://admin:912129Rjkz@cluster0.gqmcykh.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => { console.log("DB OK") })
    .catch((err) => { console.log('db error', err) })

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads')
    },
    filename:  (_, file, cb) =>{
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use('/uploads', express.static('uploads'))

app.use(express.json())




//User module
app.post('/auth/login', handleErr, loginValidation, UserController.login)
app.post('/auth/register', handleErr, registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

//Posts module
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(3004, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`It's Okay`)
})