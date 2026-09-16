const {getUser} = require("../services/auth")

async function restrictToLoggedInUserOnly(req, res, next){
    // console.log(req)
    const userUid = req.cookies?.uid;
    if(!userUid){
        return res.redirect("/login")
    }
    const user = getUser(userUid)
    console.log(`restricttologgedinuseronly user ${user}`)
    console.log(user)
    if(!user){
        return res.redirect("/login")
    }

    req.user = user;
    next();
}

async function checkAuth(req, res, next){
    // console.log(req)
    const userUid = req.cookies?.uid;
    const user = getUser(userUid)
    console.log(`checkauth user ${user}`)

    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
};