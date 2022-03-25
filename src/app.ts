import Fastify from "fastify"

const server = Fastify()
const port = 3000

server.get("/healthcheck", async function () {
  return { status: "ok" }
})

async function main() {
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
