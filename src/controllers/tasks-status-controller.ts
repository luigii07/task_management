import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TasksStatusController {
    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            status: z.enum(["pending", "in_progress", "completed"])
        })

        const { status } = bodySchema.parse(request.body)

        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.task.findUnique({ where: { id }})

        if(!task){
            throw new AppError("task not found")
        }

        if(task.status === "completed"){
            throw new AppError("this task has been completed already")
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                status
            }
        })

        const user_id = request.user?.id

        if(!user_id){
            throw new AppError("user not found")
        }

        await prisma.taskHistory.create({ data: {
            taskId: id,
            changedBy: user_id,
            oldStatus: task.status,
            newStatus: status
        }})

        return response.json()
    }
}

export { TasksStatusController }