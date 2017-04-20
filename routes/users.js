var express = require("express");
var router = express.Router();
var User = require("../models/User");

router.route("/").get(function (req, res) {
    User.find({})
        .sort({username: 1})
        .exec(function (err, users) {
            if (err) return res.json(err);
            res.render("users/index", {users: users});
        });
});

//new
router.get("/new", function (req, res) {
    var user = req.flash("user")[0] || {};
    var errors = req.flash("errors")[0] || {};
    res.render("users/new", {user: user, errors: errors});
});

//create
router.post("/", function (req, res) {
    User.create(req.body, function (err, user) {
        if (err) {
            req.flash("user", req.body);
            req.flash("errors", parseError(err));
            return res.redirect("/users/new");
        }
        res.redirect("/users");
    });
});

//show
router.get("/:username", function (req, res) {
    User.findOne({username: req.params.username}, function (err, user) {
        if (err) return res.json(err);
        res.render("users/show", {user: user});
    });
});

//edit
router.get("/:username/edit", function (req, res) {
    var user = req.flash("user")[0];
    var errors = req.flash("errors")[0] || {};
    if (!user) {
        User.findOne({username: req.params.username}, function (err, user) {
            if (err) return res.json(err);
            res.render("users/edit", {username: req.params.username, user: user, errors: errors});
        });
    } else {
        res.render("users/edit", {username: req.params.username, user: user, errors: errors});
    }
});


//update

router.put("/:username", function (req, res, next) {
    User.findOne({username: req.params.username})
        .select("password")
        .exec(function (err, user) {
            if (err) return res.json(err);

            //update user object
            user.originalPassword = user.password;
            user.password = req.body.newPassword ? req.body.newPassword : user.password;
            for (var p in req.body) {
                user[p] = req.body[p];
            }

            user.save(function (err, user) {
                if (err) return res.json(err);
                res.redirect("/users/" + req.params.username);
            });
        });
});

module.exports = router;

//에러의 형태를 {항목이름 :{message : " error message"}로 통일시켜주는 함수.
function parseError(errors) {
    var parsed = {};
    if(errors.name === 'ValidationError'){
        for(var name in errors.errors){
            var validationError = erros.erros[name];
            parsed[name] = {message:validationError.message};
        }
    } else if(eroors.code === "11000" && errors.errmsg.indexof("username")>0){
        parsed.username = {message : "This username already exists!"};
    } else{
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

