const User = require("../models/user")
const {v4: uuidv4} = require('uuid')
const {setUser} = require("../services/auth")
async function handelUserSignUp(req, res) {
    const {name, email, password} = req.body;
    await User.create({
        name,
        email,
        password,
        createdBy: req.user._id,
    });
    return res.redirect("/");
}
async function handelUserLogin(req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({email, password})
    console.log(`handel user login user ${user}`);
    if(!user) return res.render("login", {
        error: "invalid username or password", 
    });

    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId)
    return res.redirect("/");
}

module.exports = {
    handelUserSignUp,
    handelUserLogin
};