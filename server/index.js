const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const {createUser, saveDestination, checkUser, savePrefs} = require(`../helpers/dbHelpers.js`);
const port = 3000;
const utils = require('../helpers/utils.js');
let app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/save', (req, res) => {

  let destination = {
    "username": req.body.params.username,
    "address": req.body.params.address,
    create_time: new Date(Date.parse(req.body.params.create_time))  
  }

  saveDestination(destination, [req.body.params.place], (err, results) => {
    if (err) {
      console.log('err is', err);
      res.send(err);
    }
    res.send(results);
  });

});

app.post('/places', (req, res) => {
  const userQuery = req.body.params;
  const formattedQuery = userQuery.newPrefs ? utils.mapReactObj(userQuery.newPrefs) : utils.mapReactObj(userQuery.savedPrefs);
  google.convertAddressToLatLon(userQuery.address)
    .then((coords) => {
      return google.getPlaces(coords, formattedQuery);
    })
    .then((places) => {
      if (places.length) {
        let flattened = [];
        let formattedPlaces = places.map((placeCat) => {

          if (placeCat !== undefined) {
            return placeCat.map((place) => {
              let formattedPlace = {
                "type": place.type,
                "google_id": place.google_id,
                "place_name": place.place_name,
                "place_address": place.place_address,
                "rating": place.rating,
                "price_level": place.price_level,
                "thumbnail": place.thumbnail,
                "category_icon": place.category_icon,
                "place_lat": place.place_lat,
                "place_long": place.place_long,
                "distance": place.distance,
                "travel_time": place.travel_time
              };

              flattened.push(formattedPlace);

            });
          }
          return;
        });
        res.send(JSON.stringify(flattened));
      }
      else res.send('No results, please try again');
    })
    .catch((err) => {
      console.log('err searching:', err);
      res.status(500).send(err);
    })
});

app.post('/login', (req, res) => {
  const prefs = [
    {type: 'bank', query: 'chase'},
    {type: 'supermarket'},
    {type: 'gym', query: 'equinox'}
  ];

  checkUser(req.body.userObj, (err, results) => {
    if (results && results.userData) {
      let {bank, grocery_store, coffee_shop, gym_membership, laundromat, liquor_store, hair_care, restaurant, convenience_store, public_transit} = results.userData[0];

      let formattedPrefs = {
        "bank": bank,
        "supermarket": grocery_store,
        "meal_takeaway": restaurant,
        "cafe": coffee_shop,
        "gym": gym_membership,
        "liquor_store": liquor_store,
        "convenience_store": convenience_store,
        "laundry": laundromat,
        "hair_care": hair_care,
        "transit_station": public_transit
      };

      results.userData = formattedPrefs;
      res.send(JSON.stringify(results));
      return; 
    }
    const blank = [];
    res.send(blank);

  });  

})

app.post('/preferences', function (req, res) {
  let {
    bank, 
    supermarket,
    meal_takeaway,
    cafe,
    gym,
    liquor_store,
    convenience_store,
    laundry,
    hair_care,
    transit_station
    } = req.body.params.preferences;

  let username = req.body.params.username;


  let userPrefs = {
    username: username,
    password: 'pwd',
    bank: bank,
    grocery_store: supermarket,
    coffee_shop: cafe,
    restaurant: meal_takeaway,
    gym_membership: gym,
    laundromat: laundry,
    liquor_store: liquor_store,
    hair_care: hair_care,
    convenience_store: convenience_store,
    public_transit: transit_station
  } ;
  savePrefs(userPrefs, (err, prefs) => {
    res.send(prefs);
  })
});

app.get(`/tstuser`, (req, res) => {
  checkUser({username: `brian`, password: `pw`}, (err, data) => {
    if (err) {return console.error(`error when creating user ${err}`);}
    res.send(JSON.stringify(data));
  });
});

app.get(`/testdb`, (req, res) => {
  const testPlaces = [
    {
    "type": "bank",
    "google_id": "ChhhIJY9UK5gNZwokR60pPEpS1WKE",
    "place_name": "Chase Bank",
    "place_address": "355 Lexington Ave, New York",
    "rating": 3,
    "price_level": '',
    "thumbnail": "<a href=\"https:\/\/maps.google.com\/maps\/contrib\/100338243655446815049\/photos\">Chase Bank<\/a>",
    "category_icon": "https:\/\/maps.gstatic.com\/mapfiles\/place_api\/icons\/bank_dollar-71.png",
    "place_lat": 40.7501328,
    "place_long": -73.976499,
    "distance": "0.7mi",
    "travel_time": "4 mins"
  },
  {
    "type": "tank",
    "google_id": "HELLOChhhIJY9UK5gNZwokR60pPEpS1WKE",
    "place_name": "CHAISE! tank",
    "place_address": "359 Lexington Ave, New York",
    "rating": 3,
    "price_level": '',
    "thumbnail": "<a href=\"https:\/\/maps.google.com\/maps\/contrib\/100338243655446815049\/photos\">Chase Bank<\/a>",
    "category_icon": "https:\/\/maps.gstatic.com\/mapfiles\/place_api\/icons\/bank_dollar-71.png",
    "place_lat": 40.7501328,
    "place_long": -73.976499,
    "distance": "0.7mi",
    "travel_time": "4 mins",
  }
];

  const testDestination = {
    "username": "brian",
    "address": "369 Lexington Ave",
    "create_time": new Date()
  };

  saveDestination(testDestination, testPlaces, (err, results) => {
    if (err) {
      console.log('err is', err);
      res.end(err);
    } 
      res.end(results);
  });
})



app.listen(port, () => console.log(`listening on port ${port}`));