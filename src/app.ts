import Fastify, { FastifyRequest, FastifyReply } from "fastify"
import fjwt from "fastify-jwt"
import "dotenv/config"
import swagger from "fastify-swagger"
import { withRefResolver } from "fastify-zod"

import userRoutes from "./modules/user/user.route"
import productRoutes from "./modules/product/product.route"
import { userSchemas } from "./modules/user/user.schema"
import { productSchemas } from "./modules/product/product.schema"
import { version } from "../package.json"

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    user: {
      id: number
      email: string
      name: string
    }
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
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema)
  }

  server.register(
    swagger,
    withRefResolver({
      routePrefix: "/docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "Fastify API",
          description: "API Documentation",
          version: version,
        },
      },
    }),
  )

  server.register(userRoutes, { prefix: "api/users" })
  server.register(productRoutes, { prefix: "api/products" })

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
