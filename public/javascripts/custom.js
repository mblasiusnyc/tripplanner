$(document).ready(function(){

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

    this.counter = 0;
    this.hotels = [];
    this.thingsToDo = [];
    this.restaurants = [];
  };

  Day.counter = 0;

  Day.prototype.addActivity = function(type, id){
    return dayArray[currentDay-1][type].push(selects[type].itemObj[id]);
  };

  var currentDay = 1;
  var dayArray = [];
  dayArray.counter = 1;

  dayArray.addDay = function(){
    this.push(new Day());
    this.counter++;
  };
  dayArray.addDay();

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



    writeDayToDatabase(currentDay);
  //sets on click action for day 1 button
  $('#day1').on('click', function(){
    insertPlanItems();
    $("#plan-for-day").text("Plan for Day "+currentDay);
  });

  //adds new day to the nav bar
  $('#add-day').click(function(){
    dayArray.push(new Day());
    var $daybutton = $('<li data-day=' +dayArray.length+ '><a href="#">Day ' +dayArray.length+ '</a></li>');
    $daybutton.on('click', function(){
      currentDay = $daybutton.attr('data-day');
      $("#plan-for-day").text("Plan for Day "+currentDay);
      insertPlanItems();
    });
    $('#nav-days').append($daybutton);
    writeDayToDatabase(dayArray.length-1);
    console.log(dayArray);
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

  //check counter and append to itinerary
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
    addActivityToDay(selectedValue, dayArray[currentDay-1]._id, matchingSelectName);
  });

//update itinerary each function
function insertPlanItems(){
  var day = dayArray[currentDay-1];
  $("#plan-hotel").empty();
  for(var i=0; i<day.hotels.length; i++){
    var hotel = day.hotels[i];
    $("#plan-hotel").append('<li class="activity">' +hotelsObj[hotel._id].name+ '<button class="btn btn-delete-activity pull-right" data-value=' +hotelsObj[hotel._id].id+ '>Delete</button></li>');
  }
  $("#plan-things").empty();
  for(var i=0; i<dayArray[currentDay-1].thingsToDo.length; i++){
    var thing = day.thingsToDo[i];
  $("#plan-things").append('<li class="activity">' +thingsToDoObj[thing._id].name+ '<button class="btn btn-delete-activity pull-right" data-value=' +thingsToDoObj[thing._id].id+ '>Delete</button></li>');
  }

  $("#plan-restaurants").empty();
  for(var i=0; i<dayArray[currentDay-1].restaurants.length; i++){
    var restaurant = day.restaurants[i];
    $("#plan-restaurants").append('<li class="activity">' +restaurantsObj[restaurant._id].name+ '<button class="btn btn-delete-activity pull-right" data-value=' +restaurantsObj[restaurant._id].id+ '>Delete</button></li>');
  }
}

Day.prototype.populateItinerary = function(){
  var day = this;
  $("#plan-hotel").empty();
  for(var i=0; i<day.hotels.length; i++){
    var hotel = day.hotels[i];
    $("#plan-hotel").append('<li>' +hotelsObj[hotel._id].name+ '</li>');
  }
}


//use indexOf instead
  Array.prototype.contains = function(value){
    for(var i=0; i<this.length; i++){
      if(this[i] === value){
        return true;
      }
    }
    return false;
  }


//------- AJAX ------//
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
      alert(responseData);
    };

    // jQuery Ajax call
    $.post( "/days/" + dayId + "/attractions", post_data, post_callback);
  }

});
