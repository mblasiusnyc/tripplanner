$(document).ready(function(){

//---------------------- VARIABLE/DATA SETUP -------------------------//

//turn JSON data into readable obj
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


//----------------------- DAY CONSTRUCTOR -------------------------//
  var Day = function(){
    this.markers = [];
    this.hotels = [];
    this.thingsToDo = [];
    this.restaurants = [];
  };

  Day.prototype.toggleMarkers = function(bool){
    this.markers.forEach(function(marker){
      marker.setVisible(bool);
    });
  }

  Day.prototype.addActivity = function(type, id){
    return dayArray[currentDay-1][type].push(selects[type].itemObj[id]);
  };

  Day.prototype.populateItinerary = function(){
    var day = this;
    $("#plan-hotel").empty();
    for(var i=0; i<day.hotels.length; i++){
      var hotel = day.hotels[i];
      $("#plan-hotel").append('<li>' +hotelsObj[hotel._id].name+ '</li>');
    }
  }

  var dayArray = [];
  dayArray.addDay = function(){
    this.push(new Day());
  };


//--------------------------- BUTTON ON CLICK ACTIONS ---------------------------//
//sets on click action for day 1 button
  $('#day1').on('click', function(){
    dayArray[currentDay-1].toggleMarkers(false);
    currentDay = $('#day1').attr('data-day');
    dayArray[currentDay-1].toggleMarkers(true);
    $("#plan-for-day").text("Plan for Day "+currentDay);
    insertPlanItems();
  });

  $('#add-day').click(function(){
    dayArray.push(new Day());
    var $daybutton = $('<li data-day=' +dayArray.length+ '><a href="#">Day ' +dayArray.length+ '</a></li>');
    $daybutton.on('click', function(){
//FIND OUT HOW TO FIX HIGHLIGHTING BUG
      $('li').removeClass('selected');
      $daybutton.addClass('selected');
      dayArray[currentDay-1].toggleMarkers(false);
      currentDay = $daybutton.attr('data-day');
      dayArray[currentDay-1].toggleMarkers(true);
      $("#plan-for-day").text("Plan For Day "+currentDay);
      insertPlanItems();
    });
    $('#nav-days').append($daybutton);
    writeDayToDatabase(dayArray.length-1);
  });

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

//check to see if item is already in the list
    var alreadyAdded = false;
    day[matchingSelectName].forEach(function(activity){
      if(activity._id === selectedValue){
        alreadyAdded = true;
      }
    });
    console.log(!alreadyAdded);
    if(!!alreadyAdded){
        alert("You have already added this item to your itinerary.");
    } else if(counter < limit){
      day.addActivity(matchingSelectName, selectedValue);
      insertPlanItems();
      createMarker(itemObj[selectedValue]);
      dayArray[currentDay-1].toggleMarkers(true);
    } else {
      alert("You have reached the maximum number of items.");
    }
  });

//update itinerary each function
  function insertPlanItems(){
    var day = dayArray[currentDay-1];
    $("#plan-hotel").empty();
    for(var i=0; i<day.hotels.length; i++){
      var hotel = day.hotels[i];
      var $hotelButton = $('<li class="activity">' +hotelsObj[hotel._id].name+ '<button class="btn btn-delete-activity" data-value=' +hotelsObj[hotel._id].id+ '>x</button></li>');

      $("#plan-hotel").append($hotelButton);
    }
    $("#plan-things").empty();
    for(var i=0; i<dayArray[currentDay-1].thingsToDo.length; i++){
      var thing = day.thingsToDo[i];
      var thingButton = $('<li class="activity">' +thingsToDoObj[thing._id].name+ '<button class="btn btn-delete-activity" data-value=' +thingsToDoObj[thing._id].id+ '>x</button></li>');
      $("#plan-things").append(thingButton);

    }

    $("#plan-restaurants").empty();
    for(var i=0; i<dayArray[currentDay-1].restaurants.length; i++){
      var restaurant = day.restaurants[i];
      var restaurantButton = $('<li class="activity">' +restaurantsObj[restaurant._id].name+ '<button class="btn btn-delete-activity" data-value=' +restaurantsObj[restaurant._id].id+ '>x</button></li>');
      $("#plan-restaurants").append(restaurantButton);

    }
  }


//------------------------- AJAX ------------------------//
  function writeDayToDatabase(day_number){
    var post_callback = function (dbDay) {
      dayArray[dayArray.length-1]._id = dbDay._id
    };
    // jQuery Ajax call
    $.post( "/days", {"day_number": day_number}, post_callback);
  }

  function addActivityToDay(activityId, dayId, activityType) {
    var post_data = {
      day_id: dayId,
      activity_id: activityId,
      activity_type: activityType
    };
    var post_callback = function (responseData) {
    };
    // jQuery Ajax call
    $.post( "/days/" + dayId + "/attractions", post_data, post_callback);
  }

//-------------------- MAP FUNCTIONS --------------------//
function createMarker(activity){
  var latlng = new google.maps.LatLng(activity.place[0].location[0], activity.place[0].location[1]);
  var tempMarker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: activity.name
  });
  dayArray[currentDay-1].markers.push(tempMarker);
}


//-------------------- INITIALIZATIONS --------------------//
//Setup Map
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

//setup dayArray, set currentDay to 1, add first day to frontend & backend
  var currentDay = 1;
  dayArray.addDay();
  writeDayToDatabase(currentDay);


});
