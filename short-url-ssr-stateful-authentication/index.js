const express = require("express")
const path = require("path")
const URL = require("./models/url")
const urlRoute = require("./routes/url");
const { connectToMongoDb } = require("./connect");
const {restrictToLoggedInUserOnly, checkAuth} = require("./middlewares/auth");
const app = express();
const PORT = 8000;
connectToMongoDb("mongodb://127.0.0.1:27017/short-url")
const staticRoute = require("./routes/staticRouter")
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");




app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static("public"));
app.use("/url",restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);


app.use("/",checkAuth, staticRoute)
app.listen(PORT, ()=> {console.log(`server started at PORT: ${PORT}`)})