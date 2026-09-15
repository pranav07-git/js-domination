const {nanoid} = require("nanoid")
const URL = require("../models/url")
async function handelGenerateNewShortUrl(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "url is required"})
    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitedHistory: [],
    });

    return res.json({id: shortId})
}

async function handelRedirectUrl(req, res){
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    }, {
        $push: {
        visitedHistory: {
            timestamp: Date.now()
        },
    }
},

);
    res.redirect(entry.redirectURL)
}

async function handelGetAnalaytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId})
    return res.json({totalClicks: result.visitedHistory.length,
        analytics: result.visitedHistory,
    })
}
module.exports = {
    handelGenerateNewShortUrl,
    handelRedirectUrl,
    handelGetAnalaytics
}