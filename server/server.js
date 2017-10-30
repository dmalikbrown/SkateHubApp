//This is our server file
//Making my first Commit - TJ.
//console.log("Hello WOrld");

const express = require('express');
//const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
//const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');

// Connect To Database
var dbUrl = "mongodb://Dummy_User:password@ds241025.mlab.com:41025/skatehub";
mongoose.Promise = require('bluebird');
var options = {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};
mongoose.connect(dbUrl, options);

mongoose.connection.on('connected', () => {
  console.log('Connected to database '+dbUrl);
  console.log('Open thy browser to localhost:3000');
});
// On Connection
const app = express();

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.get('/darius',function(req,res){
  res.sendFile(path.join(__dirname+'/darius.html'));
  //__dirname : It will resolve to your project folder.
});


app.listen(3000);
