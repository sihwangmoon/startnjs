var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

mongoose.Promise = global.Promise;

//db connection
mongoose.connect('localhost/test');
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});

db.on("error", function (err) {
    console.log("DB Error : ", err);
});

//other setting
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//route setting
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

//port setting

app.listen(3000, function(){
    console.log("server on!");
});