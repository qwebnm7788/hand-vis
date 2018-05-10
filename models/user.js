const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function (next) {
    const user = this;
    if(this.isModified('password') || this.isNew) {             //새로운 유저이거나 비밀번호가 바뀌었다면
        bcrypt.genSalt(10, (error, salt) => {
            if(error) return next(error);
            bcrypt.hash(user.password, salt, (error, hash) => {         //salt이용 새로운 해시 값으로 저장
                if(error) return next(error);
                user.password = hash;
                next();
            });
        });
    } else {
        return next();              //바뀐것이 없다면
    }
});

userSchema.methods.validPassword = (password, callback) => {
    bcrypt.compare(password, this.password, (error, matches) => {
        if(error) return callback(error);
        callback(null, matches);
    });
};

mongoose.model('User', userSchema);