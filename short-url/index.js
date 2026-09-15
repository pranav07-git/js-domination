const express = require("express")
const urlRoute = require("./routes/url");
const { connectToMongoDb } = require("./connect");
const app = express();
const PORT = 8000;
connectToMongoDb("mongodb://127.0.0.1:27017/short-url")
app.use(express.json())
app.use("/url", urlRoute);

app.listen(PORT, ()=> {console.log(`server started at PORT: ${PORT}`)})