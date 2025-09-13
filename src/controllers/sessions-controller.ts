import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import { authConfig } from "@/configs/auth"

class SessionsController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            email: z.email(),
            password: z.string()
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({ where: { email }})

        if(!user){
            throw new AppError("user or password is invalid", 401)
        }

        const isPasswordValid = await compare(password, user.password)

        if(!isPasswordValid){
            throw new AppError("user or password is invalid", 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role }, secret as string, {
            subject: user.id,
            expiresIn
        })

        return response.json({ token })
    }
}

export { SessionsController }