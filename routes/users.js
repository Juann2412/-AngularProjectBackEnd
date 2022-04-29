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

function verifyToken(req,res){
    console.log("dans users node")
    //console.log(req.headers)
    //var token = req.headers['x-access-token'];
    var token = req.body.token;
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });    
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        User.findById(req.userId, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.status(200).send(user);
          });
  }); 
  
}
module.exports = { login,register,verifyToken};