import Fastify, { FastifyRequest, FastifyReply } from "fastify"
import fjwt from "fastify-jwt"
import "dotenv/config"

import userRoutes from "./modules/user/user.route"
import { userSchemas } from "./modules/user/user.schema"

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any
  }
}

export const server = Fastify()
const port = 3000

server.register(fjwt, {
  secret: process.env.JWT_SECRET as string,
})

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (e) {
      return reply.send(e)
    }
  },
)

server.get("/healthcheck", async function () {
  return { status: "ok" }
})

async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema)
  }

  server.register(userRoutes, { prefix: "api/users" })

  try {
    await server.listen(port, "0.0.0.0", () => {
      console.log("Server listening on " + port)
    }) // '0.0.0.0' is for docker
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
