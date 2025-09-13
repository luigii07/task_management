import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TasksAssignmentsUserController {
    async assign(request: Request, response: Response){
        const bodySchema = z.object({
            user_id: z.uuid()
        })

        const { user_id } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({ where: { id: user_id }})

        if(!user){
            throw new AppError("user not found", 401)
        }

        const paramsSchema = z.object({
            id: z.uuid()
        })
        
        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.task.findUnique({ where : { id }})

        if(!task){
            throw new AppError("task not found")
        }

        if(user_id === task.assignedTo){
            throw new AppError("this user is already assigned to this task")
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                assignedTo: user_id
            }
        })

        return response.status(201).json()
    }

    async remove(request: Request, response: Response){
        const bodySchema = z.object({
            user_id: z.uuid()
        })

        const { user_id } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({ where: { id: user_id }})

        if(!user){
            throw new AppError("user not found", 401)
        }

        const paramsSchema = z.object({
            id: z.uuid()
        })
        
        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.task.findUnique({ where : { id }})

        if(!task){
            throw new AppError("task not found")
        }

        if(user_id !== task.assignedTo){
            throw new AppError("this user is not assigned to this task")
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                assignedTo: null
            }
        })

        return response.json()
    }
}

export { TasksAssignmentsUserController }