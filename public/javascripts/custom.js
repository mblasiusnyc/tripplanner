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

//set up day 1 array and constructor
  var Day = function(){
    this.hotels = [];
    this.thingsToDo = [];
    this.restaurants = [];
  }
  var dayArray = [];
  var firstDay = new Day();
  dayArray.push(firstDay);

  //set counters for max items
var hotelCounter = 0;
var thingCounter = 0;
var restaurantCounter = 0;
var dayCounter = 1;


var hotelPlanList = $("#plan-hotel");
var thingPlanList = $("#plan-things");
var restaurantPlanList = $("#plan-restaurants");

//variables used by add buttons
  var selects = {
    hotels: [$("#hotel-selector"), hotelObj, hotelPlanList, hotelCounter, 1],
    thingsToDo: [$("#thing-selector") , thingObj, thingPlanList, thingCounter, 3],
    restaurants: [$("#restaurant-selector"), restaurantObj, restaurantPlanList, restaurantCounter, 3]
  };

  //adds new day to the nav bar
  $('#add-day').click(function(){
    dayCounter++;
    var daybutton = '<li><a href="#">Day ' +dayCounter+ '</a></li>';
    $('#nav-days').append(daybutton);
    var day = new Day();
    dayArray.push(day);
    console.log(dayArray);
  });


  $(".addBtn").on('click',function() {
    event.preventDefault();
    var $this = $(this);

    // this will be "thingsToDo", "restaurants", or "hotels"
    var matchingSelectName = $this.attr('data-select');
    var matchingSelect = selects[matchingSelectName];
    var selectedValue = matchingSelect[0].val();
    var itemObj = matchingSelect[1];
    var listToAppendTo = matchingSelect[2];
    var counter = matchingSelect[3];
    var limit = matchingSelect[4];


  //check counter and append to itinerary
    if(counter < limit){
      listToAppendTo.append('<li>' +itemObj[selectedValue].name+ '</li>');
      matchingSelect[3]++;
console.log("dayArray is : "+dayArray)
console.log("dayArray[dayCounter-1] is : "+dayArray[dayCounter-1])
console.log("dayArray[dayCounter-1].matchingSelectName is : "+dayArray[dayCounter-1].matchingSelectName);
      dayArray[dayCounter-1][matchingSelectName].push(selectedValue);


    } else {
      alert("You have reached the maximum number of items.");
    }

  //adds the marker to the map
    var latlng = new google.maps.LatLng(itemObj[selectedValue].place[0].location[0],itemObj[selectedValue].place[0].location[1]);

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: 'Hello World!'
    });
  });
});
