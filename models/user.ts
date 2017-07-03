import mongoose = require('mongoose');
import crypto = require('crypto');
import jwt = require("jsonwebtoken");

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  passwordHash: String,
  salt: String,
});

UserSchema.method('setPassword', function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
});

UserSchema.method('validatePassword', function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
  return (hash === this.passwordHash);
});

UserSchema.method('generateJWT', function(role) {
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email,
    role: role,
  }, 'SecretKey');
});

export default mongoose.model('User', UserSchema);
