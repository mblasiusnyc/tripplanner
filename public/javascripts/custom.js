$(document).ready(function(){

  var map;
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(40.716916, -73.995402),
        zoom: 13
      };
      map = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
    }
    google.maps.event.addDomListener(window, 'load', initialize);

//set up dayArray, and initialize first day
  var Day = function(){
    this.hotels = [];
    this.thingsToDo = [];
    this.restaurants = [];
  }

  Day.prototype.addActivity = function(type, id){
    return dayArray[currentDay-1][type].push(selects[type].itemObj[id]);
  }

  var dayArray = [];
  dayArray.push(new Day());
  var currentDay = 1;

//turn data into readable obj
  var hotelsObj = {};
  for(var i = 0; i < all_hotels.length; i++){
    hotelsObj[all_hotels[i]._id] = all_hotels[i];
  };

  var thingsToDoObj = {};
  for(var i = 0; i < all_things_to_do.length; i++){
    thingsToDoObj[all_things_to_do[i]._id] = all_things_to_do[i];
  };

  var restaurantsObj = {};
  for(var i = 0; i < all_restaurants.length; i++){
    restaurantsObj[all_restaurants[i]._id] = all_restaurants[i];
  };


  //sets on click action for day 1 button
  $('#day1').on('click', function(){
    currentDay = 1;
    insertPlanItems();
    $("#plan-for-day").text("Plan for Day "+currentDay);
  });

  //adds new day to the nav bar
  $('#add-day').click(function(){
    dayArray.push(new Day());
      console.log(dayArray);
    var $daybutton = $('<li data-day=' +dayArray.length+ '><a href="#">Day ' +dayArray.length+ '</a></li>');
    $daybutton.on('click', function(){
      currentDay = $daybutton.attr('data-day');
      $("#plan-for-day").text("Plan for Day "+currentDay);
      insertPlanItems();
    });
    $('#nav-days').append($daybutton);
  });

//variables used by add buttons
  var selects = {
    hotels: {
      selector: $("#hotel-selector"),
      itemObj: hotelsObj,
      itinerarySection: $("#plan-hotel"),
      limit: 1
    },
    thingsToDo: {
      selector: $("#thing-selector"),
      itemObj: thingsToDoObj,
      itinerarySection: $("#plan-things"),
      limit: 3
    },
    restaurants: {
      selector: $("#restaurant-selector"),
      itemObj: restaurantsObj,
      itinerarySection: $("#plan-restaurants"),
      limit: 3
    },
  };

  $(".addBtn").on('click',function() {
    event.preventDefault();
    var day = dayArray[currentDay-1];
    var $this = $(this);
    var matchingSelectName = $this.attr('data-select');
    var matchingSelect = selects[matchingSelectName];
    var selectedValue = matchingSelect.selector.val();
    var itemObj = matchingSelect.itemObj;
    var listToAppendTo = matchingSelect.itinerarySection;
    var limit = matchingSelect.limit;
    var counter = day[matchingSelectName].length;

  //check counter and append to itinerary
    console.log(day[matchingSelectName]);
    console.log(day[matchingSelectName].contains(selectedValue));
    console.log(matchingSelect.selector.val());
    if((day[matchingSelectName].contains(selectedValue))){
      alert("You have already added this item to your itinerary.");
    }
    else if(counter < limit){
      day.addActivity(matchingSelectName, selectedValue);
      insertPlanItems();
    } else {
      alert("You have reached the maximum number of items.");
    }

  //adds the marker to the map
    var latlng = new google.maps.LatLng(itemObj[selectedValue].place[0].location[0],itemObj[selectedValue].place[0].location[1]);
    console.log(latlng);

  });

//update itinerary each function
  function insertPlanItems(){
    var day = dayArray[currentDay-1]
    $("#plan-hotel").empty();
    for(var i=0; i<day.hotels.length; i++){
      var hotel = day.hotels[i];
      $("#plan-hotel").append('<li>' +hotelsObj[hotel._id].name+ '</li>');
    }
    $("#plan-things").empty();
    for(var i=0; i<dayArray[currentDay-1].thingsToDo.length; i++){
      var thing = day.thingsToDo[i];
      $("#plan-things").append('<li>' +thingsToDoObj[thing._id].name+ '</li>');
    }
    $("#plan-restaurants").empty();
    for(var i=0; i<dayArray[currentDay-1].restaurants.length; i++){
      var restaurant = day.restaurants[i];
      $("#plan-restaurants").append('<li>' +restaurantsObj[restaurant._id].name+ '</li>')
    }
  }

  Array.prototype.contains = function(value){
    for(var i=0; i<this.length; i++){
      if(this[i] === value){
        return true;
      }
    }
    return false;
  }
});
