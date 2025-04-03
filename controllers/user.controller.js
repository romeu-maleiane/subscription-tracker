import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


export const getUsers = async (req, res, next) => {

    try{
        const users = await User.find()

        res.status(200).json({success: true, data: users})
    } catch(error){
        next(error)
    }
}


export const getUser = async (req, res, next) => {

    try{
        
        const user = await User.findOne({ _id: req.params.id })

        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        res.status(200).json({success: true, data: user})
    } catch(error){
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const {email, name, password} = req.body
        const exitingUser = await User.findOne({ email })

        if(exitingUser){
            const error = new Error('User alredy exists')
            error.statusCode = 409
            throw error
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = await User.create([{email, name, password: hashedPassword}], {session})

        session.commitTransaction()
        session.endSession()
        res.status(201).json({
            success: true,
            message: 'User created successfuly',
            user: newUser[0]
        })
    } catch(error){
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}