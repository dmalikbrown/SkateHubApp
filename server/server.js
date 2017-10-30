//This is our server file
//Making my first Commit - TJ.
//console.log("Hello WOrld");

const express = require('express');
//const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
//const passport = require('passport');
const mongoose = require('mongoose');

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


// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+dbUrl);
});
const app = express();
