import { Router } from "express"

import { TasksController } from "@/controllers/tasks-controller"
import { TasksStatusController } from "@/controllers/tasks-status-controller"
import { TasksAssignmentsUserController } from "@/controllers/tasks-assignments-user-controller"
import { TasksAssignmentsTeamController } from "@/controllers/tasks-assignments-team-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyAuthorization } from "@/middlewares/verify-authorization"

const tasksRoutes = Router()

const tasksController = new TasksController()
const tasksStatusController = new TasksStatusController()
const tasksAssignmentsUserController = new TasksAssignmentsUserController()
const tasksAssignmentsTeamController = new TasksAssignmentsTeamController()


tasksRoutes.use(ensureAuthenticated)

tasksRoutes.get("/", verifyAuthorization(["admin", "member"]), tasksController.index)
tasksRoutes.patch("/:id", verifyAuthorization(["admin", "member"]), tasksController.update)

tasksRoutes.use(verifyAuthorization(["admin"]))

tasksRoutes.post("/", tasksController.create)
tasksRoutes.delete("/:id", tasksController.delete)

tasksRoutes.patch("/:id/status", tasksStatusController.update)

tasksRoutes.patch("/:id/assignee", tasksAssignmentsUserController.assign)
tasksRoutes.patch("/:id/assignee/remove", tasksAssignmentsUserController.remove)

tasksRoutes.patch("/:id/team", tasksAssignmentsTeamController.assign)
tasksRoutes.patch("/:id/team/remove", tasksAssignmentsTeamController.remove)

export { tasksRoutes }