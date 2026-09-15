const express = require("express");

const router = express.Router();

const {handleGetAllUsers, handelGetUserById, handelPutUpdateUserById, handelPatchUpdateUserById, handelDeleteUserById, handelCreateUserById} = require("../controllers/user")

router.route("/:id").get(handelGetUserById)
.put(handelPutUpdateUserById)
.patch(handelPatchUpdateUserById)
.delete(handelDeleteUserById);


router.route('/').get(handleGetAllUsers).post(handelCreateUserById)



module.exports = router;