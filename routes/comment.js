const router = require("express").Router();
const auth = require("../middleware/auth");
let Comment = require("../models/comment.model");

router.route("/:id").get(auth, (req, res) => {
    Comment.findById(req.params.id, (err, comment) => {
        if (err) res.status(400).json("Error: ", err);
        else res.status(200).json(comment);
    });
});

module.exports = router;