import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { z } from "zod"

class TasksController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            title: z.string().min(4),
            description: z.string().min(4),
            priority: z.enum(["high", "medium", "low"])
        })

        const { title, description, priority } = bodySchema.parse(request.body)

        await prisma.task.create({ data: {
            title,
            description,
            priority
        }})

        return response.json()
    }

    async index(request: Request, response: Response){
        const user = request.user
        
        if(user?.role === "admin"){
            const tasks = await prisma.task.findMany()

            return response.json(tasks)
        }
        
        const directTasks = await prisma.task.findMany({
            where: { assignedTo: user?.id },
        });

        const teamTasks = await prisma.task.findMany({
            where: {
            team: {
                users: {
                some: {
                    userId: user?.id,
                },
                },
            },
            },
        });

        const allTasks = [...directTasks, ...teamTasks];
        const uniqueTasks = Array.from(new Map(allTasks.map(t => [t.id, t])).values());

        return response.json(uniqueTasks)
    }

    async update(request: Request, response: Response){
        const bodySchema = z.object({
            title: z.string().min(4),
            description: z.string().min(4),
            priority: z.enum(["high", "medium", "low"])
        })

        const { title, description, priority } = bodySchema.parse(request.body)

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

        const user = request.user

        if(!user){
            throw new AppError("user not found")
        }

        if(user.role === "member"){
            const isAuthorizated = await prisma.task.findFirst({
                where: {
                    AND: [
                        {
                            id
                        },
                        {
                            assignedTo: user.id
                        }
                    ]
                }
            })

            if(!isAuthorizated){
                throw new AppError("the user can not alter this task")
            }
        }

        await prisma.task.update({
            where: {
                id
            },
            data: {
                title,
                description,
                priority
            }
        })

        return response.json()
    }

    async delete(request: Request, response: Response){
        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.task.findUnique({ where: { id }})

        if(!task){
            throw new AppError("task not found")
        }

        await prisma.task.delete({ where: { id } })

        return response.json()
    }
}

export { TasksController }