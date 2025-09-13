import expres from "express"
import { errorHandling } from "@/middlewares/error-handling"
import { routes } from "@/routes"

const app = expres()

app.use(expres.json())

app.use(routes)

app.use(errorHandling)

export { app }