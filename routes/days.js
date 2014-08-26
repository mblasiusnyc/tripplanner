var express = require('express');
var router = express.Router();
var models = require('../models');


router.post('/', function(req,res, next){
  var newDay = new models.Day(req.body);
  newDay.save(function(err,day) {
    res.json(day);
  });
});

router.post('/:dayId/attractions',function(req,res,next){
  var day_id = req.body.day_id;
  // var day_id = req.params.dayId;
  var activityId = req.body.activity_id;
  var activityType = req.body.activity_type;

  models.Day.findOne({"_id": day_id}, function(err,day){
    if(err) return next(err);
    day[activityType].push(activityId);

    day.save(function(err,day) {
      res.json(day);
      console.log(day);
    })
  });
});

router.get('/', function(req,res){
  //...list all days...
});

module.exports = router;
