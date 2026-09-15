const express = require("express");
const { handelGenerateNewShortUrl, handelRedirectUrl, handelGetAnalaytics } = require("../controllers/url")
const router = express.Router();

router.post('/', handelGenerateNewShortUrl);
router.get('/:shortId', handelRedirectUrl)

router.get("/analytics/:shortId", handelGetAnalaytics)
module.exports = router;