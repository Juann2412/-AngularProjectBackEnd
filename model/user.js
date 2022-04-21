let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
     email: String,
    password: String,
    isAdmin: Boolean
});
module.exports = mongoose.model('User', UserSchema);