import { Request, Response, NextFunction } from "express"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import { verify } from "jsonwebtoken"

type TokenPayload = {
    sub: string
    role: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
    const auth = request.headers.authorization

    if(!auth){
        throw new AppError("JWT token not found", 401)
    }

    const [, token] = auth?.split(" ")

    const { secret } = authConfig.jwt

    const { sub: user_id, role } = verify(token, secret) as TokenPayload

    request.user = {
        id: user_id,
        role
    }

    next()
}

export { ensureAuthenticated }