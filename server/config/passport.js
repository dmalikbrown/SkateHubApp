const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
  let secret = "2017-11-20 23:52:291211635275399870131421393217846107168351807835241506674495890246549867007470974291162240824812535450";
  opts.secretOrKey = secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

    User.getUserById(jwt_payload._id, (err, user) => { //may have to change the jwt_payload
      if(err){
        return done(err, false);
      }

      if(user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

}
