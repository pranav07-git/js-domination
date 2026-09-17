const setUserObjectToMap = new Map();

function setUser(id, user){
    setUserObjectToMap.set(id, user);
}

function getUser(id){
    return setUserObjectToMap.get(id);
}

module.exports = {
    setUser,
    getUser,
}