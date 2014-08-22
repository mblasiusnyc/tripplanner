$(document).ready(function(){

//turn hotels into obj
  var hotelObj = {};
  for(var i = 0; i < all_hotels.length; i++){
    hotelObj[all_hotels[i]._id] = all_hotels[i];
  };

  var thingObj = {};
  for(var i = 0; i < all_things_to_do.length; i++){
    thingObj[all_things_to_do[i]._id] = all_things_to_do[i];
  };

  var restaurantObj = {};
  for(var i = 0; i < all_restaurants.length; i++){
    restaurantObj[all_restaurants[i]._id] = all_restaurants[i];
  };

  //set counters for max items
var hotelCounter = 0;
var thingCounter = 0;
var restaurantCounter = 0;
var dayCounter = 2;


  //adds new day to the nav bar
  $('#add-day').click(function(){
    var daybutton = '<li><a href="#">Day ' +dayCounter+ '</a></li>';
    $('#nav-days').append(daybutton);
    dayCounter++;
  });


var selects = {
  hotels: [$("#hotel-selector"), hotelObj, hotelCounter, ],
  thingsToDo: [$("#thing-selector") , thingObj, thingCounter],
  restaurants: [$("#restaurant-selector"), restaurantObj, restaurantCounter]
 };

$(".addBtn").on('click',function() {
  event.preventDefault();
  var $this = $(this);

  // this will be "thingsToDo", "restaurants", or "hotels"
  var matchingSelectName = $this.attr('data-select');
  var matchingSelect = selects[matchingSelectName];
  var itemObj = matchingSelect[1];
  var selectedValue = matchingSelect[0].val();
  console.log(selectedValue);

  var latlng = new google.maps.LatLng(itemObj[selectedValue].place[0].location[0],itemObj[selectedValue].place[0].location[1]);

  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: 'Hello World!'
  });



});


//set click action of dropdown add buttons



// $("#add-hotel").click(function(){
//   if(hotelCounter < 1){
//     var selected = $("#hotel-selector").val();
//     $("#plan-hotel").append('<li>' +selected+ '</li>');
//     hotelCounter++;
//   } else {
//     alert("You have reached the maximum number of hotels.");
//   }
// });

// $("#add-thingtodo").click(function(){
//   if(thingCounter < 3){
//     var selected = $("#thing-selector").val();
//     $("#plan-things").append('<li>' +selected+ '</li>');
//     thingCounter++;
//   } else {
//     alert("You have reached the maximum number of things to do.");
//   }
// });

// $("#add-restaurant").click(function(){
//   if(restaurantCounter < 3){
//     var selected = $("#restaurant-selector").val();
//     $("#plan-restaurants").append('<li>' +selected+ '</li>');
//     restaurantCounter++;
//   } else {
//     alert("You have reached the maximum number of restaurants.");
//   }
// });

//adds map marker on click


});