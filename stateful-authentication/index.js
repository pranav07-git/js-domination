const express = require("express");
const staticRouter = require("./routes/staticRouter")
const userRouter = require("./routes/user")
const path = require("path")
const app = express();
const {connectToMongoDb} = require("./connect")
const {checkAuth} = require("./middlewares/auth")
const cookieParser = require("cookie-parser");

connectToMongoDb("mongodb://127.0.0.1:27017/test-auth")
const PORT = 8000;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static("public"))
app.use("/", checkAuth, staticRouter);
app.use("/user", userRouter);


app.listen(PORT, () => console.log(`server connected to ${PORT}`));