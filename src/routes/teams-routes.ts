import { Router } from "express"

import { TeamsController } from "@/controllers/teams-controller"
import { TeamsMembersController } from "@/controllers/teams-members-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyAuthorization } from "@/middlewares/verify-authorization"

const teamsRoutes = Router()

const teamsController = new TeamsController()
const teamsMembersController = new TeamsMembersController()

teamsRoutes.use(ensureAuthenticated, verifyAuthorization(["admin"]))

teamsRoutes.post("/", teamsController.create)
teamsRoutes.get("/", teamsController.index)
teamsRoutes.put("/:id", teamsController.update)


teamsRoutes.post("/:team_id/users/:user_id", teamsMembersController.create)
teamsRoutes.delete("/:team_id/users/:user_id", teamsMembersController.remove)

export { teamsRoutes }