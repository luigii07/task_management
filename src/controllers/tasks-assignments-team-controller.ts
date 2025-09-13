import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TasksAssignmentsTeamController {
    async assign(request: Request, response: Response){
        const bodySchema = z.object({
            team_id: z.uuid()
        })

        const { team_id } = bodySchema.parse(request.body)

        const team = await prisma.team.findUnique({ where: { id: team_id }})

        if(!team){
            throw new AppError("team not found", 401)
        }

        const paramsSchema = z.object({
            id: z.uuid()
        })
        
        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.task.findUnique({ where : { id }})

        if(!task){
            throw new AppError("task not found")
        }

        if(team_id === task.teamId){
            throw new AppError("this team is already assigned to this task")
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                teamId: team_id
            }
        })

        return response.status(201).json()
    }

    async remove(request: Request, response: Response){
        const bodySchema = z.object({
            team_id: z.uuid()
        })

        const { team_id } = bodySchema.parse(request.body)

        const team = await prisma.team.findUnique({ where: { id: team_id }})

        if(!team){
            throw new AppError("team not found", 401)
        }

        const paramsSchema = z.object({
            id: z.uuid()
        })
        
        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.task.findUnique({ where : { id }})

        if(!task){
            throw new AppError("task not found")
        }

        if(team_id !== task.teamId){
            throw new AppError("this team is not assigned to this task")
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                teamId: null
            }
        })

        return response.json()
    }
}

export { TasksAssignmentsTeamController }