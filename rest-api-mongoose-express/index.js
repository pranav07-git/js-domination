const express = require("express");
const mongoose = require("mongoose")
const fs = require("fs");
// monogo connection 
mongoose.connect('mongodb://127.0.0.1:27017/test-app-1')
.then(() => console.log("mongo db connected"))
.catch((err) => console.log(`monogo db error: ${err}`))

const app = express();
const port = 8000;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    jobTitle: {
        type: String
    },
    gender: {
        type: String
    }

}, {timestamps: true});

const User = mongoose.model('user', userSchema)
app.use(express.urlencoded({ extended: false}));

app.use((req, res, next)=> {
    fs.appendFile("log.txt", `\n${Date.now()} ${req.method}: ${req.path}`, (err, data)=> {
        next();
    });
})



app.route("/api/users/:id").get( async (req, res)=>{
    const user = await User.findById(req.params.id)
    if(!user) res.status(404).json({err: "user not found"})
    return res.json(user);
})
.put(async (req, res)=> {
    await User.findByIdAndUpdate(req.params.id, {
        firstName: req.first_name,
        lastName: req.last_name,
        email: req.email,
        gender: req.gender,
        jobTitle: req.jobTitle,
    }, {new: true});
    if (!user) {
        return res.status(404).json({ msg: "user not found" });
    }
    return res.json({msg: "sucesss"});
})
.patch(async (req, res)=>{
    await User.findByIdAndUpdate(req.params.id, {lastName: "changed"})
    return res.json({msg: "success"})
})
.delete(async (req, res)=> {
    await User.findByIdAndDelete(req.params.id)
    return res.json({msg: "success"})
});

app.post("/api/users", async (req, res) =>{
    const body = req.body;
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg: "all fields are require"})
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title 
    })
    console.log(result)
    return res.status(201).json({msg: "success"})
})  



app.get('/api/users', async (req, res) => {
    const allDbUsers = await User.find({})
    res.setHeader("X-myName", "pranav")
    console.log(req.headers)
    const html = `
     <ul>
        ${allDbUsers.map((user)=> `<li>${user.firstName} - ${user.email}</li>`).join("")}
     </ul>
    `
    res.send(html)
})





app.listen(port, ()=> console.log(`server started at ${port}`))

