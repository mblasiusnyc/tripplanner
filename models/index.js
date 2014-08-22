var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripplanner'); //connects us to mongodb
var db = mongoose.connection;  //defines an object that has properties of our mongodb connection
db.on('error', console.error.bind(console, 'mongodb connection error'));  //defines error response

var Place, Hotel, ThingsToDo, Restaurant, Day;
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  address: String,
  city: String,
  state: String,
  phone: Number,
  location: [Number, Number],
});

var hotelSchema = new Schema({
  name: String,
  place: [placeSchema],
  num_stars: Number,
  amenities: String,
});

var thingsToDoSchema = new Schema({
  name: String,
  place: [placeSchema],
  age_range: String,
});

var restaurantSchema = new Schema({
  name: String,
  place: [placeSchema],
  cuisine: String,
  price: Number,
});

var daySchema = new Schema({
  number: Number,
  hotel: [hotelSchema],
  thingsToDo: [thingsToDoSchema],
  restaurants: [restaurantSchema]
});



Place = mongoose.model('Place', placeSchema);
Hotel = mongoose.model('Hotel', hotelSchema);
ThingsToDo = mongoose.model('ThingsToDo', thingsToDoSchema);
Restaurant = mongoose.model('Restaurant', restaurantSchema);
Day = mongoose.model('Day', daySchema);

module.exports = {"Place": Place, "Hotel": Hotel, "ThingsToDo": ThingsToDo, "Restaurant": Restaurant, "Day": Day};