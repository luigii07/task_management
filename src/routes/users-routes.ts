import { Router } from "express"

import { UserController } from "@/controllers/users-controller"

const usersRoutes = Router()

const userController = new UserController()

usersRoutes.post("/", userController.create)
usersRoutes.get("/", userController.index)

export { usersRoutes }