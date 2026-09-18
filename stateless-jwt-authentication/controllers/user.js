const User = require("../models/user")
const {setUser} = require("../services/auth")
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
    const token = setUser(user);
    res.cookie("uuid", token)
    return res.redirect('/')

}
module.exports = {
    handelUserSignUp,
    handelUserLogin
}