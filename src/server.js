const http = require("http")
require('dotenv').config()
const cluster = require("cluster"); // to use multiple threads of the cpu
const numCPUs = require("os").cpus().length;
const port = process.env.PORT
// handling any Promise rejection in whole code which is not handled. 
process.on('unhandledRejection',(err)=>{console.log("Unhandled Rejection ", err)}) 
process.on('uncaughtException',(err) =>{console.log("Uncaught Exception ", err)})

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);  
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
} else {

    console.log(`Worker ${process.pid} started`);
    const {connectToMongo} = require("./config/connectToDB")
    const setupExpress = require('./config/express')
    const app = setupExpress()
    // Connect MongoDB
    const httpServer = http.createServer(app);
    connectToMongo(process.env.MONGODB_URI,JSON.parse(process.env.DB_OPTIONS));
    httpServer.listen(port);
    // Create server using Express app (shared with socket.io)
}