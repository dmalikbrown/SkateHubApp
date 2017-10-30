//This is our server file
//Making my first Commit - TJ.
// console.log("Hello WOrld");

let express = require('express');
//const path = require('path');
let bodyParser = require('body-parser');
let cors = require('cors');
//const passport = require('passport');
let mongoose = require('mongoose');

let path    = require("path");
let app     = express();

// Connect To Database
let dbUrl = "mongodb://Dummy_User:password@ds241025.mlab.com:41025/skatehub";
mongoose.Promise = require('bluebird');
let options = {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};
mongoose.connect(dbUrl, options);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+dbUrl);
  console.log('Open thy browser to localhost:3000');
});

app.listen(3000);
