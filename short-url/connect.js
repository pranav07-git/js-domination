const mongoose = require("mongoose");

async function connectToMongoDb(url){
    return await mongoose.connect(url)
    .then(()=> console.log("connected to mongo db"))
    .catch((err)=> console.log(`failed to connect monogo db ${err}`))
}


module.exports = {
    connectToMongoDb
};