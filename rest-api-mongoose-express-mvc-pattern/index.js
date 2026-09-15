const express = require("express"); 
const {connectMongoDb} = require("./connection")
const {logReqRes} = require("./middlewares")
const userRouter = require("./routes/user")

// Connection
connectMongoDb("mongodb://127.0.0.1:27017/test-app-1")


const app = express();
const port = 8000;


app.use(express.urlencoded({ extended: false}));

app.use(logReqRes('log.txt'))




app.use("/api/users", userRouter);




app.listen(port, ()=> console.log(`server started at ${port}`))

