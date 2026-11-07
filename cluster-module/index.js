const express = require("express")

const app = express();
const PORT = 8000;

app.get("/", (req, res)=> {
    return res.json({
        message: `hello from express server ${process.pid}`
    });
})

app.listen(PORT, () => {console.log(`server started at localhost:${PORT}`)})


