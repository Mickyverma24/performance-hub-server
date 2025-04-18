const http = require("http");
const cluster = require("cluster"); // to use multiple threads of the cpu
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
require("dotenv").config();
const numCPUs = require("os").cpus().length; // number of present thread os server.

const { PORT, MONGODB_URI, DB_OPTIONS } = process.env;
// handling any Promise rejection in whole code which is not handled.
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection ", err);
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception ", err);
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  // setup connections between the workers
  setupPrimary();

  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  cluster.setupPrimary({
    serialization: "advanced",
  });

  httpServer.listen(PORT, () => {
    console.log("Master process is listening on the, ", port);
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
  const { Server } = require("socket.io");
  const { connectToMongo } = require("./config/connectToDB");
  const setupExpress = require("./config/express");
  // Connect MongoDB
  connectToMongo(MONGODB_URI, JSON.parse(DB_OPTIONS));
  const app = setupExpress(); // to use all the routes of http requst
  const httpServer = http.createServer(app); // for listening all http request routed from master.
  // Create server using Express app (shared with socket.io)
  const io = new Server(httpServer);
  io.adapter(createAdapter());
  setupWorker(io); // Let sticky handle the connection
  // main logic for handling multiple to-do
}
