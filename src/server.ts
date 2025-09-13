import { app } from "@/app"

import { env } from "@/env"

app.listen(env.PORT, () => console.log(`Server is runing on port ${env.PORT}`))