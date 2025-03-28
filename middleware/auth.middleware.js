import { JWT_SECRET } from "../config/env.js";
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js";


export const authorize = async (req, res, next) => {

    try{
        let token;

        // Verify if the token exists
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){            
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return res.status(401).json({message: 'Unauthorized' })
        }

        // Decode the token
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(decoded.userId)

        if(!user) return res.status(401).json({message: 'Unauthorized'})

        req.user = user

        next()

    } catch(error){
        res.status(401).json({ message: error.message })
    }
}