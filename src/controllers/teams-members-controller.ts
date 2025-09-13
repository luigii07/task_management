import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamsMembersController {
    async create(request: Request, response: Response){
        const paramsSchema = z.object({
            user_id: z.uuid(),
            team_id: z.uuid(),
        })

        const { user_id, team_id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUnique({ where: { id: user_id }})

        if(!user){
            throw new AppError("user not found", 401)
        }
        
        const team = await prisma.team.findUnique({ where: { id: team_id }})
        
        if(!team){
            throw new AppError("team not found", 401)
        }

        await prisma.teamMember.create({ 
            data: {
                userId: user_id,
                teamId: team_id,
            }
        })

        return response.status(201).json()
    }

    async remove(request: Request, response: Response){
        const paramsSchema = z.object({
            user_id: z.uuid(),
            team_id: z.uuid(),
        })

        const { user_id, team_id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUnique({ where: { id: user_id }})

        if(!user){
            throw new AppError("user not found", 401)
        }
        
        const team = await prisma.team.findUnique({ where: { id: team_id }})
        
        if(!team){
            throw new AppError("team not found", 401)
        }

        const userInTeam = await prisma.teamMember.findFirst({
            where: {
                AND: [
                    {
                        userId: user_id,
                    },
                    {
                        teamId: team_id,
                    },
                ]
            }
        })

        if(!userInTeam){
            throw new AppError("the user is not be in this team")
        }

        await prisma.teamMember.delete({ where: { id: userInTeam.id }})

        return response.json()
    }
}

export { TeamsMembersController }