var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var async = require("async");

const UserSchema = mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        bcrypt:true
    },
    type:{
        type:String
    }
});
var User = module.exports = mongoose.model('User', UserSchema);

//Get Single User byID
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

//Get SingUser by username
module.exports.getUserByUsername = function(username, callback){
    User.findOne({username : username}, callback);
};
//Compare Password
module.exports.comparePassword = function(candidatepassword, hash, callback){
    bcrypt.compare(candidatepassword, hash, function(err, result){
        if(err) throw err;
        callback(null, result);
    });
};
//Create Student User
module.exports.saveStudent = function(newUser, newStudent, callback){
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if (err) throw err;
        
        newUser.password = hash;
        console.log('Student is being saved');
        newUser.save(callback);
        newStudent.save(callback);
    });
};

//Create Instructor User
module.exports.saveInstructor = function(newUser, newInstructor, callback){
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if (err) throw err;
        
        newUser.password = hash;
        console.log('Instructor is being saved');
        newUser.save(callback);
        newInstructor.save(callback);
    });
};
