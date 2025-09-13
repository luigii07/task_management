import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamsController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().min(4),
            description: z.string().min(10)
        })

        const { name, description } = bodySchema.parse(request.body)

        await prisma.team.create({ data: {
            name,
            description
        }})

        return response.json()
    }

    async index(request: Request, response: Response){
        const teams = await prisma.team.findMany({
            include: {
                users: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        })

        return response.json({ teams })
    }

    async update(request: Request, response: Response){
        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const team = await prisma.team.findUnique({ where: { id } })

        if(!team){
            throw new AppError("team not found")
        }

        const bodySchema = z.object({
            name: z.string().min(4),
            description: z.string().min(10)
        })

        const { name, description } = bodySchema.parse(request.body)

        await prisma.team.update({ 
        where: {
            id
        },
        data: {
            name,
            description
        }})

        return response.json()
    }
}

export { TeamsController }