var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var User = require('../models/user');
var Student = require('../models/student');

router.get('/classes', function(req, res, next) {
    Student.getStudentByUsername(req.user.username, function(err, result){
        res.render('students/classes', {student:result});
    });
});
router.get('/classes/:id/lessons/new', function(req, res, next) {
    res.render('students/newlesson',{class_id:req.params.id});
});  
//Class Register
router.post('/classes/register', function(req, res, next) {

    info = [];
    info['student_username'] = req.user.username;
    info['class_id'] = req.body.class_id;
    info['class_title'] = req.body.class_title;

    Student.register(info, function(err, student){
        if(err) throw err;
        console.log(student);
    });
    req.flash('success_msg', 'You are now registered to learn this class');
    res.redirect('/students/classes');
});

//Add Lessons
router.post('/classes/:id/lessons/new', function(req, res, next) {
    info = [];
    info['class_id'] = req.params.id;
    info['lesson_number'] = req.body.lesson_number;
    info['lesson_title'] = req.body.lesson_title;
    info['lesson_body'] = req.body.lesson_body;

    req.checkBody('lesson_number', 'Lesson_Number filed is required').notEmpty();
    req.checkBody('lesson_title', 'Lesson_Title filed is required').notEmpty();
    req.checkBody('lesson_body', 'Lesson_Body filed is required').notEmpty();

    var errors = req.validationErrors();
    
    if (errors)
    {
        res.render('students/newlesson',{errors : errors, class_id : req.params.id});
        return;
    }
    Class.addLesson(info, function(err, lesson){
        console.log(lesson);
    });
    req.flash('success_msg', 'You have added a Lesson');
    res.redirect('/students/classes');
});

module.exports = router;