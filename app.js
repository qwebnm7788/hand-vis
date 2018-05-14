const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const dbConfig = require('./db');
const User = require('./models/user');
const port = 5555; 

//DB setting
mongoose.Promise = global.Promise;      //nodejs의 native promise 사용
mongoose.connect(dbConfig.url)          //연결정보 이용 DB 연결
    .then(() => console.log("connected to the mongodb"))
    .catch(e => console.log(e));

//Express setting
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());                                 //json형식 사용
app.use(express.static(path.join(__dirname, 'public')));    //public 폴더의 정적파일 접근
app.use(session({
    secret: 'handvis',
    resave: false,
    saveUninitialized: true
}));

//passport js setting 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user.username);
});
  
passport.deserializeUser(function(username, done) {
    console.log('deserializeUser');
    User.findById(username, (err, user) => {
        done(err, user);
    })
});

passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true,
        passReqToCallback: true
    },
    (req, username, password, done) => {
        //username을 갖는 유저가 DB에 존재하는지 확인
        User.findOne({'username': username}, (err, user) => {
            if(err) return done(err);

            if(!user) {
                console.log('User Not Found with username ' + username);
                return done(null, false);
            }

            console.log("LOGIN");
            return user.comparePassword(password, (err, isMatch) => {
                if(isMatch) {
                    return done(null, user);
                }
                return done(null, false);
            })
        });
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

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/signup', (req, res) => {
    var newUser = {
        username: req.body.username,
        password: req.body.password
    };
    console.log(newUser);
    User.create(newUser, (err, user) => {
        if(err) return res.json({success: false, message: err});
        res.sendFile(path.join(__dirname, 'public', 'main.html'));
    });
});

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