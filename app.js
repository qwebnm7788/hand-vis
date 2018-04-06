var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var fs = require('fs');

var port = 5555;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


app.get('/', (req, res) => {
    console.log("CHECK");
    res.redirect('login.html');
}); 

server.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});