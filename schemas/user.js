const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Id: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
});


UserSchema.virtual('userId').get(function(){
    return this._id.toHexString();
});

UserSchema.set('toJSON',{
    virtuals:true,//JSON형태로  userId를 출력한다.
});

module.exports=mongoose.model("User",UserSchema);