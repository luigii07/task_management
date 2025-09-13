import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"

function verifyAuthorization(role: string[]){
    return (request: Request, response: Response, next: NextFunction) => {
        if(!request.user){
            throw new AppError("unauthorizated", 401)
        }

        if(!role.includes(request.user.role)){
            throw new AppError("unauthorizated", 401)
        }

        next()
    }
}

export { verifyAuthorization }