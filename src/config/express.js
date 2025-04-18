const express = require('express')
const cors = require('cors')
module.exports = ()=>{
    const app = express()
    // handling incoming json payloads.
    app.use(express.json())
    // handling cors policies.
    app.use(
        cors({
          origin: (origin, callback) => {
            const allowedOrigins = ['*'];
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
              callback(null, true);
            } else {
              const error = new Error('Invalid request origin');
              error.stack = undefined;
              error.statusCode = 403;
              callback(error);
            }
          },
          credentials: true,
        }),
      );
    app.use("/",(req,res) =>{
      res.send("Server is up and running...!")
    })

    return app
}
