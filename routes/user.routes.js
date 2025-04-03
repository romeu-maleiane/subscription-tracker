import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers } from "../controllers/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const userRouter = Router()


userRouter.get('/', getUsers )

userRouter.get('/:id', authorize ,getUser )

userRouter.post('/', createUser)

userRouter.put('/:id', (req, res) => { res.send({title: 'UPDATE user'})})

userRouter.delete('/:id', deleteUser)

export default userRouter;