var express = require('express');
var router = express.Router();

var Class = require('../models/class');
//Class Page
router.get('/', function(req, res, next) {
    Class.getClasses(function(err, result){
        if(err) throw err;
        res.render('classes/index', {classDatas : result});
  },3);
});


//Detail
router.get('/:id/detail', function(req, res, next){
    Class.getClassById(req.params.id, function(err, result){
        if(err) throw err;
        res.render('classes/detail', {class:result});
    });  
});

router.get('/:id/lessons', function(req, res, next){
    Class.getClassById(req.params.id, function(err, result){
        if(err) throw err;
        res.render('classes/lessons', {class:result});
    });  
});

router.get('/:id/lessons/:lesson_number', function(req, res, next){
    Class.getClassById(req.params.id, function(err, result){
        if(err) throw err;
        
        for(i=0; i<result.lessons.length; i++){
            if(result.lessons[i].lesson_number = req.params.lesson_number){
                lesson = result.lessons[i];
                break;
            }
        }
        res.render('classes/lesson', {class:result, lesson:lesson});
    });
});

module.exports = router;
