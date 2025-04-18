const mongoose = require('mongoose')

const connectToMongo = async (uri,options)=>{
    try{
        await mongoose.connect(uri,options)
        console.log("Connection with database is succuss full!")
    }
    catch(err){
        console.log("Error while connecting to DB: ", err)
        process.exit(1)
    }

}
module.exports={connectToMongo}