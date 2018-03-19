var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

app.get('/', (req, res) => {
    console.log('connected by ' + req.ip);
    res.sendFile("public/index.html", {root: __dirname});
});

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});