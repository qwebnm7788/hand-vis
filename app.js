var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var port = 5555;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.redirect('login.html');
}); 

app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});