import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', (req, res) => {res.send({title: 'GET all subscriptions'})})

subscriptionRouter.get('/:id', (req, res) => { res.send({title: 'GET subscription details'})})

subscriptionRouter.post('/', authorize, createSubscription )

subscriptionRouter.put('/:id', (req, res) => { res.send({title: 'UPDATE subscription'})})

subscriptionRouter.delete('/:id', (req, res) => { res.send({title: 'DELETE subscription'})})

subscriptionRouter.get('/user/:id', authorize, getUserSubscription )

subscriptionRouter.delete('/:id/cancel', (req, res) => { res.send({title: 'Cancel subscription'})})

subscriptionRouter.get('/upcaming-renewals', (req, res) => { res.send({title: 'GET upcaming renewals'})})

export default subscriptionRouter;