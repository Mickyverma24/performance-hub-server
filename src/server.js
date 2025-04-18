const http = require("http")
const setupExpress = require('./config/express')
require('dotenv').config()
// const express = require('express')
// handling any Promise rejection in whole code which is not handled. 
process.on('unhandledRejection',(err)=>{console.log("Unhandled Rejection ", err)}) 
process.on('uncaughtException',(err) =>{console.log("Uncaught Exception ", err)})

const app = setupExpress(); // setting up express app for handling http request
const port = process.env.PORT || 5001;
app.set('port', port);
// const app = express()
const server = http.createServer(app);




server.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT NUMBER ${port}`);
});
