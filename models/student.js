var mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    first_name : {
        type : String
    },
    last_name :
    {
        type : String
    },
    address : [{
        street_address : {type: String},
        city : {type: String},
        state : {type: String},
        zip : {type: String}
    }],
    username : {
        type: String
    },
    email : {
        type : String
    },
    classes :[{
        class_id: {type : mongoose.Schema.Types.ObjectId},
        class_title:{type: String}
    }]
});

var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.getStudentByUsername = function(username, callback){
    Student.findOne({username : username}, callback);
};

module.exports.register = function(info, callback){
    username = info['student_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];
    const query = {username : username};
    
    Student.findOneAndUpdate(query, {$push:{classes : {class_id : class_id, class_title: class_title}}},
        {safe:true, upsert:true}, callback);
};