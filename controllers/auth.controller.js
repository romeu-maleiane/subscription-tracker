import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const { name, email, password } = req.body

        // check if user already exists
        const exitingUser = await User.findOne({email})

        if(exitingUser){
            const error = new Error('User already exists')
            error.statusCode = 409
            throw error
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create([{name, email, password: hashedPassword }], {session})

        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success: true,
            message: 'User created successfuly',
            data: {
                token,
                user: newUser[0]
            } 
        })
    } catch(err){
        await session.abortTransaction()
        session.endSession()
        next(err)
    }
}


export const signIn = async(req, res, next) => {

    try{
        const { password, email } = req.body

        const user = await User.findOne({email})

        if(!user){
            res.status(404).json({message: 'User not found' })
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            res.status(401).json({message: 'Invalid Password' })
            const error = new Error('Invalid Password')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    
        res.status(200).json({
            success: true,
            message: 'User signed in successfuly',
            data: {
                token,
                user
            }
        })
    } catch(error){
        next(error)
    }

}