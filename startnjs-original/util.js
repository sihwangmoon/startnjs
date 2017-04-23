var util = {};

util.parseError = function (errors) {
    var parsed = {};
    if (errors.name == 'ValidationError') {
        for (var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = {message: validationError.message};
        }
    } else if (errors.code == "10000" && errors.errmsg.indexOf("username") > 0) {
        parsed.username = {message: "This username already exists"};
    }
    return parsed;
}

util.getDate = function (dateObj) {
    if (dateObj instanceof Date)
        return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth() + 1) + "-" + get2digits(dateObj.getDate());
}

util.getTime = function (dateObj) {
    if (dateObj instanceof Date)
        return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes()) + ":" + get2digits(dateObj.getSeconds());
}

module.exports = util;

// private functions
function get2digits(num) {
    return ("0" + num).slice(-2);
}

util.isLoggedin = function (req, res, next) {
    if(req.isAuthenticated()){
        next();;
    } else{
        req.flash("errors", {login:"Please login first"});
        res.redirect("/login");
    }
}

util.noPermission = function (req, res) {
    req.flash("errors", {login:"You don't have permission"});
    req.logout();
    res.redirect("/login");
}