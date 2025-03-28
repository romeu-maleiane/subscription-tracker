/* eslint-disable no-unreachable */
import mongoose from "mongoose";
import { DB_URL, NODE_ENV } from "../config/env.js";

if(!DB_URL){
    throw new Error('Please define the MONGODB_URL enviroment variable inside .env.<development/production>.local')

}

const connectToDataBase = async () => {
    try{
        mongoose.connect(DB_URL)
        console.log('DB_URL:', DB_URL);
        console.log(`connected in ${NODE_ENV} mode`)
    } catch(error){
        console.error('Error connecting to database: ',error)

        process.exit(1)
    }
}


export default connectToDataBase