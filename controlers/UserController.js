import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from '../models/User.js'

export const register = async (req, res) => {

    try {

        const password = req.body.password
        const salt = await bcrypt.genSalt(10) //алгоритм шифровки
        const hash = await bcrypt.hash(password, salt) //передаем пароль шифратору вместе с алгоритмом шифровки 

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        }) //Создаем пользователя => заполняем полученными данными

        const user = await doc.save() // сохраняем нашего пользователя в монго

        const token = jwt.sign({
            _id: user._id,
        },
            "secret",
            {
                expiresIn: '30d',
            }
        )

        const { passwordHash, ...UserData } = user._doc

        res.json({ ...UserData, token })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегестрироваться"
        })
    }

}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Not found'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id,
        },
            "secret",
            {
                expiresIn: '30d',
            }
        )

        const { passwordHash, ...UserData } = user._doc

        res.json({ ...UserData, token })


    } catch (err) {
        console.log(err)
        res.statys(500).json({
            message: "Не удалось авторизоваться"
        })
    }
}

export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Нет пользователя'
            })
        }

        const { passwordHash, ...UserData } = user._doc

        res.json(UserData)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегестрироваться"
        })
     }
}