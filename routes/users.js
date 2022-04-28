var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
let User = require('../model/user');

function login(req,res){
    let userEmail = req.body.email
    User.findOne({
        email : userEmail
    }, (err, user) =>{
        if (err) return res.status(500).send("There was a problem .")
        if (!user) return res.status(200).send({auth: false , token : null});
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, 'supersecret', {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ auth: true, token: token , user : user });  
    })
}

function register(req,res){
     var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        email : req.body.email,
        password : hashedPassword,
        isAdmin : "false"
        },function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        // create a token
        var token = jwt.sign({ id: user._id }, 'supersecret', {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token , user : user});
      });       
}

module.exports = { login,register};