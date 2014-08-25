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
    this.markers = [];
  }

  Day.prototype.addActivity = function(type, id){

  }

  var dayArray = [];
  dayArray.push(new Day());
  var currentDay = 1;

//turn data into readable obj
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



//map marker push/insertion/removal functions
function pushMarker(coords){
  var marker = new google.maps.Marker({
      position: coords,
      setMap: map,
      title: 'Hello World!'
    });
  dayArray[currentDay-1].markers.push(marker);
};

  function insertMarkers(){
    for(var i=0; i<dayArray[currentDay-1].markers.length; i++){
      console.log(dayArray[currentDay-1].markers[i]);
      dayArray[currentDay-1].markers[i].setMap(map);
    };
  };

  function removeMarkers(){
    setAllMap(null);
  }

  //sets on click action for day 1 button
  $('#day1').on('click', function(){
    currentDay = 1;
    insertMarkers();
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
      insertMarkers();
      insertPlanItems();
    });
    $('#nav-days').append($daybutton);
  });

//variables used by add buttons
// selects[0] = select list
// selects[1] = data object
// selects[2] = itinerary list
// selects[3] = limit of items per day
  var selects = {
    hotels: [$("#hotel-selector"), hotelObj, $("#plan-hotel"), 1],
    thingsToDo: [$("#thing-selector") , thingObj, $("#plan-things"), 3],
    restaurants: [$("#restaurant-selector"), restaurantObj, $("#plan-restaurants"), 3]
  };

  $(".addBtn").on('click',function() {
    event.preventDefault();
    var $this = $(this);
    var matchingSelectName = $this.attr('data-select');
    var matchingSelect = selects[matchingSelectName];
    var selectedValue = matchingSelect[0].val();
    var itemObj = matchingSelect[1];
    var listToAppendTo = matchingSelect[2];
    var limit = matchingSelect[3];
    var counter = dayArray[currentDay-1][matchingSelectName].length;

  //check counter and append to itinerary
    if((dayArray[currentDay-1][matchingSelectName].contains(selectedValue))){
      alert("You have already added this item to your itinerary.");
    }
    else if(counter < limit){
      // listToAppendTo.append('<li>' +itemObj[selectedValue].name+ '</li>');
      dayArray[currentDay-1][matchingSelectName].push(selectedValue);
      insertPlanItems();
    } else {
      alert("You have reached the maximum number of items.");
    }

  //adds the marker to the map
    var latlng = new google.maps.LatLng(itemObj[selectedValue].place[0].location[0],itemObj[selectedValue].place[0].location[1]);
    pushMarker(latlng);

  });

//update itinerary each function
  function insertPlanItems(){
    $("#plan-hotel").empty();
    for(var i=0; i<dayArray[currentDay-1].hotels.length; i++){
      $("#plan-hotel").append('<li>' +hotelObj[dayArray[currentDay-1].hotels[i]].name+ '</li>')
    }
    $("#plan-things").empty();
    for(var i=0; i<dayArray[currentDay-1].thingsToDo.length; i++){
      $("#plan-things").append('<li>' +thingObj[dayArray[currentDay-1].thingsToDo[i]].name+ '</li>')
    }
    $("#plan-restaurants").empty();
    for(var i=0; i<dayArray[currentDay-1].restaurants.length; i++){
      $("#plan-restaurants").append('<li>' +restaurantObj[dayArray[currentDay-1].restaurants[i]].name+ '</li>')
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
