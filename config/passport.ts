import passport = require('passport');
import mongoose = require('mongoose');
let LocalStrategy = require('passport-local').Strategy;
let User:any = mongoose.model('User');

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err,user) {
    if(err) {
      return done(err);
    };
    if(!user) {
      return done(null, false, { message: 'Invalid Username' });
    };
    if(!user.validatePassword(password)) {
      return done(null, false, { message: 'Invalid Password' });
    };
    return done(null, user);
  });
}));
