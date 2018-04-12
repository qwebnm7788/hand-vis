var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var port = 5555;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));


//userActions -> 현재 접속중인 사용자의 수만큼 존재
//접속중인 사용자에게 고유한 번호를 나누어 주어 그 값으로 접근
//현재 해당 사용자의 currentAction값을 가지고 있게 된다.

var userActions = {
    0: {
        currentAction: 3
    }
};

app.get('/', (req, res) => {
    res.redirect('login.html');
}); 

app.post('/recognition', (req, res) => {
    console.log(req.body);
    console.log(req.body.outer.value);
    res.status(200).end();
});

app.get('/ajaxtest', (req, res) => {
    res.jsonp(userActions[0]);
});

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});