import server from "./server.js";
import chalk from "chalk"

const port = 4000

server.listen( port, ()=> {
    console.log(chalk.blue.bold(`Server is running in the port:${port}`))
})