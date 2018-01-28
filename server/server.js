//This is our server file
//Making my first Commit - TJ.
//console.log("Hello WOrld");

const express = require('express');
//const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
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
  console.log('Server is up.');
});
// On Connection
const app = express();
const skatehub = require('./routes/routes');


const port = process.env.PORT || 3000;


// Body Parser Middleware
var bodyOptions = {
  limit: '50mb'
}
app.use(bodyParser.json(bodyOptions));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// CORS Middleware
app.use(cors());
app.use(function(req, res, next) {
  // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
});

//Initialize passport
require('./config/passport')(passport);

app.use('/skatehub', skatehub);


app.listen(port);
