const express = require("express")
const app = express()
const http = require("http")
const socketIo = require("socket.io")
const routes = require("./routes/index")
const helmet = require("helmet")
const debug = require("debug")("backend:index")
const morgan = require("morgan")

app.use(helmet())
app.set("trust proxy", true)

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"))
}

const server = http.createServer(app)
const io = socketIo(server, {
    path: "/appsocket",
    transports: ["websocket"],
    upgrade: false,
})
const port = process.env.BACKEND_PORT

const inspectionSocket = io.of("/inspectionsocket")

inspectionSocket.on("connection", (socket) => {
    debug("New client connected:", socket.id)
    socket.on("disconnect", () => {
        debug("Client disconnected")
    })
})

// save namespace objects using express, so we can refer to it in our routes
app.set("inspectionsocket", inspectionSocket)

app.use(
    express.json({
        type: [
            "application/json",
            "text/plain", // AWS sends this content-type for its messages/notifications
        ],
    }),
)
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
    }),
)

app.use("/auth", require("./routes/auth").router)
app.use("/api", routes)

// Starting server, which consumes express app
server.listen(port, async() => {
    debug(`Backend server running on port ${port}.`)
})