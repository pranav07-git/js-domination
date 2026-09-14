const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs");


const app = express();
const port = 8000;
app.use(express.urlencoded({ extended: false}));


app.route("/api/users/:id").get((req, res)=>{
    const id = Number(req.params.id)
    const user = users.find((user)=> user.id === id);
    return res.json(user);
})
.put((req, res)=> {
    const id = Number(req.params.id)
    const user = users.find((user)=> user.id === id)
    const body = req.body
    Object.assign(user, body)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=> {
        return res.json(`id: ${id}`)
    })
})
.patch((req, res)=>{
    const id = Number(req.params.id);
    const user = users.findIndex((user)=> user.id === id);
    const body = req.body;
    users[user] = {
        id: id,
        ...body
    }
    fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        return res.json(`id ${id}`);
    })
})
.delete((req, res)=> {
    const id = Number(req.params.id)
    const user = users.findIndex((user)=> user.id === id);
    users.splice(user, 1)
    fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data)=> {
        return res.json(`id: ${id}`)
    })
});

app.post("/api/users", (req, res) =>{
    const body = req.body;
    users.push({...body, id: users.length+1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=> {
        return res.json({status: "success", id: users.length})
    })
})



app.get('/api/users', (req, res) => {
    const html = `
     <ul>
        ${users.map((user)=> `<li>${user.first_name}</li>`).join("")}
     </ul>
    `
    res.send(html)
})





app.listen(port, ()=> console.log(`server started at ${port}`))

