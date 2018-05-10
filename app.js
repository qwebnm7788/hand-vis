const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const port = 5555; 

const userSchema = new mongoose.Schema({
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

userSchema.methods.comparePassword = (inputPassword, cb) => {
    if(inputPassword === this.password) {
        cb(null, true);
    } else {
        cb('error');
    }
};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());                                 //json형식 사용
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'handvis',
    resave: false,
    saveUninitialized: true
}));

//passport js 사용 
app.use(passport.initialize());
app.use(passport.session());                //session 사용

var users = [
    {
        username: "jaewon",
        password: "1111"
    }
];

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user.username);
});
  
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser');
    var user = users[0];
    if(user.username === id) {
        done(null, user);
    }
});

passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true,
        passReqToCallback: true
    },
    (req, username, password, done) => {
        console.log('LocalStrategy');
        var user = users[0];
        if(user.username == username) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

//userActions -> 현재 접속중인 사용자의 수만큼 존재
//접속중인 사용자에게 고유한 번호를 나누어 주어 그 값으로 접근
//현재 해당 사용자의 currentAction값을 가지고 있게 된다.

var userActions = {
    0: {
        currentAction: 3
    }
};

var currentAction = {
    
}

app.get('/', (req, res) => {
    res.redirect('/login');
}); 

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', passport.authenticate('login', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/recognition', (req, res) => {
    console.log(req.body);
    currentAction = req.body;
    res.status(200).end();
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));

});

app.post('/main', (req, res) => {
    res.redirect('/main');
});

app.get('/ajaxtest', (req, res) => {
    res.jsonp(currentAction);
});

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});