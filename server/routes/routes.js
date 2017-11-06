const express = require('express');
const router = express.Router();
//const passport = require('passport');
//const jwt = require('jsonwebtoken');
//const config = require('../config/database');
const User = require('../models/user');

// '/skatehub/register'
router.post('/authenticate', (req, res, next) => {
  console.log(req.body);
  res.json({success: true, msg: 'hello world'});
});


module.exports = router;
