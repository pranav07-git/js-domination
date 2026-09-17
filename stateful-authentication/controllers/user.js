const User = require("../models/user")
const {setUser} = require("../services/auth")
const {v4: uuidv4} = require("uuid")
async function handelUserSignUp(req, res){
    const {name, email, password} = req.body;
    console.log(name, email, password)
    await User.create({
        name,
        email,
        password
    })
    return res.redirect("/")
}


async function handelUserLogin(req, res){
    const {email, password} = req.body;
    const user = await User.findOne({email, password});
    if(!user) return res.redirect('/login');
    const sessionId = uuidv4();
    setUser(sessionId, user);
    console.log(setUser)
    res.cookie("uuid", sessionId)
    return res.redirect('/')

}
module.exports = {
    handelUserSignUp,
    handelUserLogin
}