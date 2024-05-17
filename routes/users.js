const express = require("express");
const router = express.Router();

router.get("/cool", (req, res, next) => {
   res.send("you're so cool")
})

module.exports = router;