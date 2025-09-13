import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { hash } from "bcrypt"

class UserController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().min(2),
            email: z.email(),
            password: z.string().min(6)
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if(user){
            throw new AppError("this email already use", 401)
        }

        const passwordHashed = await hash(password, 8)

        await prisma.user.create({ data: {
            name,
            email,
            password: passwordHashed
        }})

        return response.json()
    }

    async index(request: Request, response: Response){
        const users = await prisma.user.findMany()

        const usersWithoutPassword = users.map((user) => {
            const { password, ...userWithoutPassword } = user

            return userWithoutPassword
        })

        return response.json(usersWithoutPassword)
    }
}

export { UserController }