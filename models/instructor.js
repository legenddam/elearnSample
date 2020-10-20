var mongoose = require('mongoose');

const InstructorSchema = mongoose.Schema({
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

var Instructor = module.exports = mongoose.model('Instructor', InstructorSchema);
module.exports.getInstructorByUsername = function(username, callback){
    Instructor.findOne({username : username}, callback);
};


module.exports.register = function(info, callback){
    username = info['instructor_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];
    const query = {username : username};
    
    Instructor.findOneAndUpdate(query, {$push:{classes : {class_id : class_id, class_title: class_title}}},
        {safe:true, upsert:true}, callback);
};