$(document).ready(function(){

  //adds new day to the nav bar
  var dayCounter = 2;
  $('#add-day').click(function(){
    var daybutton = '<li><a href="#">Day ' +dayCounter+ '</a></li>';
    $('#nav-days').append(daybutton);
    dayCounter++;
  });

//set click action of dropdown add buttons

//set counters for max items
var hotelCounter = 0;
var thingCounter = 0;
var restaurantCounter = 0;

$("#add-hotel").click(function(){
  event.preventDefault();
  if(hotelCounter < 1){
    var selected = $("#hotel-selector").val();
    $("#plan-hotel").append('<li>' +selected+ '</li>');
    hotelCounter++;
  } else {
    alert("You have reached the maximum number of hotels.");
  }
});

$("#add-thingtodo").click(function(){
  event.preventDefault();
  if(thingCounter < 3){
    var selected = $("#thing-selector").val();
    $("#plan-things").append('<li>' +selected+ '</li>');
    thingCounter++;
  } else {
    alert("You have reached the maximum number of things to do.");
  }
});

$("#add-restaurant").click(function(){
  event.preventDefault();
  if(restaurantCounter < 3){
    var selected = $("#restaurant-selector").val();
    $("#plan-restaurants").append('<li>' +selected+ '</li>');
    restaurantCounter++;
  } else {
    alert("You have reached the maximum number of restaurants.");
  }
});

//adds map marker on click


});