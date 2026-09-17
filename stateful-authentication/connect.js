const mongoose = require("mongoose");

function connectToMongoDb(url){
    return mongoose.connect(url)
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log(`{err}: connecting to mongodb`))
}

module.exports = {
    connectToMongoDb
}