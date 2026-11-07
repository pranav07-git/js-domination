const cluster = require("node:cluster");
const express = require("express")
const os = require("node:os");
const totalCpus = os.availableParallelism();


if(cluster.isPrimary){
    for (let i = 0; i < totalCpus; i++) {
        cluster.fork();
        
    }
} else{
    const app = express();
    const PORT = 8000;
    app.get("/", (req, res)=> {
    return res.json({
        message: `hello from express server ${process.pid}`
    });
})
    app.listen(PORT, () => {console.log(`server started at localhost:${PORT}`)})

}