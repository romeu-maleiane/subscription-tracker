import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscription, getSubscriptions, getSubscriptionDetails } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', getSubscriptions)

subscriptionRouter.get('/:id', getSubscriptionDetails)

subscriptionRouter.post('/', authorize, createSubscription )

subscriptionRouter.put('/:id', (req, res) => { res.send({title: 'UPDATE subscription'})})

subscriptionRouter.delete('/:id', (req, res) => { res.send({title: 'DELETE subscription'})})

subscriptionRouter.get('/user/:id', authorize, getUserSubscription )

subscriptionRouter.delete('/:id/cancel', (req, res) => { res.send({title: 'Cancel subscription'})})

subscriptionRouter.get('/upcaming-renewals', (req, res) => { res.send({title: 'GET upcaming renewals'})})

export default subscriptionRouter;