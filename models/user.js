const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//User 스키마 작성 -> username, password로 구성
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

userSchema.pre("save", function(done) {
    var user = this;
    if(!user.isModified("password")) {
        return done();
    }else {
        bcrypt.genSalt(function(err, salt) {
            if(err) return done(err);
            bcrypt.hash(user.password, salt, function(err, hashedPassword) {
                if(err) return done(err);
                user.password = hashedPassword;
                done();
            });
        });
    }
});

userSchema.methods.comparePassword = function(password, done) {
    var user = this;
    bcrypt.compare(password, user.password, function(err, isMatch) {
        done(err, isMatch);
    })
}

module.exports = mongoose.model('User', userSchema);