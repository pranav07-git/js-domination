const { getUser } = require("../services/auth");

async function checkAuth(req, res, next){
    const userUid = req.cookies?.uuid;
    console.log(`userUid: ${userUid}`)
    const user = getUser(userUid);
    console.log(`check auth middleware user ${user}`);
    req.user = user;
    console.log(`user: ${user}`)
    next(); 
}
module.exports = {
    checkAuth
}