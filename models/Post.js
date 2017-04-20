var mongoose = require("mongoose");

//schema
var postSchema = mongoose.Schema({
    title:{type:String, required:true},
    body:{type:String},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date},
},{
    toObject:{virtuals:true}
});


//virtual 처리로 실제 db에는 저장되지 않지만 모델에서는 다른항목과 동일하게 사용가능(get.set함수 설정)
postSchema.virtual("createdDate")
.get(function () {
    return getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function () {
    return getTime(this.createdAt);
});

postSchema.virtual("updatedDate")
.get(function () {
    return getDate(this.updatedAt);
});

postSchema.virtual("updatedTime")
.get(function () {
    return getTime(this.updatedAt);
});

var Post = mongoose.model("post", postSchema);
module.exports = Post;

//functions

function get2digits(num) {
    return("0" + num).slice(-2);
}

function getDate(dateObj) {
    if(dateObj instanceof Date)
        return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+ 1)+ "-"
            + get2digits(dateObj.getDate());
}

function getTime(dateObj) {
    if(dateObj instanceof Date)
        return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":"
            + get2digits(dateObj.getSeconds());
}

