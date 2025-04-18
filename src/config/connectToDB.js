const mongoose = require('mongoose')

const connectToMongo = async (uri,DB_OPTIONS)=>{
    try{
        await mongoose.connect(uri,DB_OPTIONS)
        console.log("Connection with database is succuss full!")
    }
    catch(err){
        console.log("Error while connecting to DB: ", err)
        process.exit(1)
    }

}
module.exports={connectToMongo}