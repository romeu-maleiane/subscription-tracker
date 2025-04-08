import { workflowClient } from '../config/upstash.js'
import Subscription from '../models/subscription.model.js'
import {SERVER_URL} from '../config/env.js'

export const createSubscription = async (req, res, next) => {

    try{

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        })

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0
        })

        res.status(201).json({
            success: true,
            data: subscription,
            workflowRunId
        })
    } catch(error){
        next(error)
    }
}

export const getSubscriptions = async (req, res, next) => {
    try{
        const subscriptions = await Subscription.find()

        res.status(200).json({succes: true, data: subscriptions})
    } catch(err){
        next(err)
    }
}

export const getSubscriptionDetails = async(req, res, next) => {
    try{
        const subscriptionId = req.params.id

        const subscriptionDetails = await Subscription.findOne({ _id: subscriptionId })

        if(!subscriptionDetails){
            const error = new Error('Subscription not found')
            error.statusCode = 404
            throw error
        }

        res.status(200).json({success: true, data: subscriptionDetails})
    } catch(err){
        next(err)
    }
}

export const getUserSubscription = async (req, res, next) => {

    try{
        if(req.user._id != req.params.id){
            const error = new Error('You are not the owner of this subscrption')
            error.statusCode = 401
            throw error
        }

        const subscriptions = await Subscription.find( {user: req.params.id} )

        res.status(200).json({success: true, data: subscriptions })
    } catch(error){
        next(error)
    }
}