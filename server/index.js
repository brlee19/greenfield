const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const { getPrefs, saveDestination, checkUser, savePrefs } = require(`../helpers/dbHelpers.js`);
const port = 3000;
const utils = require('../helpers/utils.js');
let app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/save', (req, res) => {
  console.log('trying to save', req.body.params.place);
  console.log('user is', req.body.params.username);
  console.log('dest is', req.body.params.address)
  console.log('create time is', new Date(Date.parse(req.body.params.create_time)), ' typeof: ', typeof req.body.params.create_time);

  let destination = {
    "username": req.body.params.username,
    "address": req.body.params.address,
    create_time: new Date(Date.parse(req.body.params.create_time))  
  }

  saveDestination(destination, [req.body.params.place], (err, results) => {
    console.log('in the saveDestination callback');
    if (err) {
      console.log('err is', err);
      res.send('boo');
    }
    console.log('results are', results);
    res.send(results);
  });

  //SAVE PLACE INTO DB
  // res.send('server is trying to save');
})

app.post('/places', (req, res) => {
  const userQuery = req.body.params;
  // format query differently based on whether it came from user or from DB
  const formattedQuery = userQuery.newPrefs ? utils.mapReactObj(userQuery.newPrefs) : utils.mapReactObj(userQuery.savedPrefs);

  // console.log('get userQuery from front', userQuery);
  // console.log('DEBUGGING FORMAT OF PREFS', formattedQuery);
  google.convertAddressToLatLon(userQuery.address)
    .then((coords) => { // use lat/lng to chain the next API call
      return google.getPlaces(coords, formattedQuery); //have to map object into array
    })
    .then((places) => {
      console.log('DEBUGGING: places inside index.js is', JSON.stringify(places));
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
          console.log('flattened?', flattened[0]);
          return;
        });
        console.log('correctly flattening api results?', JSON.stringify(flattened[0]));
        res.send(JSON.stringify(flattened));
      }
      else res.send('No results, please try again'); //no results so need to try again
    })
    .catch((err) => { //send error code and message asking user to try again
      console.log('err searching:', err);
      res.status(500).send(err);
    })
});

//TO FILL IN

app.get('/', function (req, res) {
  console.log(req)
  res.send('received username')
});

app.post('/login', async (req, res) => {
  console.log('user trying to login is', req.body.userObj.username);
  // check DB for user
    // if user not found, send to signup page
    // if user found and has no prefs, send back blank array so React sends user to prefs
    // if user found and has prefs, send back prefs
  try {
    const userPrefs = await getPrefs(req.body.userObj);
    console.log('userPrefs are', userPrefs)
    if (userPrefs && userPrefs.userData) {
      // need to sync these names across schema and API
      const {bank, grocery_store, coffee_shop, gym_membership, laundromat,
        liquor_store, hair_care, restaurant, convenience_store, public_transit} = userPrefs.userData;

      const formattedPrefs = {
        'bank': bank,
        'supermarket': grocery_store,
        'meal_takeaway': restaurant,
        'cafe': coffee_shop,
        'gym': gym_membership,
        'liquor_store': liquor_store,
        'convenience_store': convenience_store,
        'laundry': laundromat,
        'hair_care': hair_care,
        'transit_station': public_transit
      };

      //can avoid this mutation too once names are synced...should match google API
      userPrefs.userData = formattedPrefs;
      console.log('results userdata in checkuser /login route:', JSON.stringify(userPrefs.userData));
      res.send(JSON.stringify(userPrefs))
    }

    if (userPrefs === 'user does not exist') {
      res.send('user does not exist');
    }
    //user exists but has not set any prefs
    res.send('user has no prefs');

  } catch(e) {
    console.error('error trying to retrieve user prefs', e);
    res.status(500).send('Error trying to retrieve user prefs');
  }

})

app.post('/preferences', function (req, res) {
  // console.log(req)
  // include controller for database query 
  // res.send('recieved preferences')
  console.log(req.body);
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
  } 
  
  // req.body.params.preferences 
  //     { bank: 'Chase',
  //       supermarket: 'any',
  //       meal_takeaway: '',
  //       cafe: '',
  //       gym: '',
  //       liquor_store: true,
  //       convenience_store: false,
  //       laundry: false,
  //       hair_care: false,
  //       transit_station: false },
  //    username: 'br' } }
  //save to database
  console.log(`username is ${username} and prefs are ${userPrefs}`)

  savePrefs(userPrefs, (err, prefs) => {
    res.send(prefs);
  })
});

//create test users
app.get(`/tstuser`, (req, res) => {
  checkUser({username: `brian`, password: `pw`}, (err, data) => {
    if (err) {return console.error(`error when creating user ${err}`);}
    res.send(`ROMA VICTA, data:${JSON.stringify(data)}`);
  });
})


//test the db and helper functions
app.get(`/testdb`, (req, res) => {
  console.log(`incoming get request recieved at "/testdb"`);

  //should be a post and user = req.body.username

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
    console.log('in the saveDestination callback');
    if (err) {
      console.log('err is', err);
      res.end('boo');
    } 
      console.log('results are', results);
      res.end('ROMA FUCKING VICTA!');
  });
})



app.listen(port, () => console.log(`listening on port ${port}`));