const mysql = require(`mysql`);

const connection = mysql.createConnection({
  multipleStatements: true,
  user: `root`,
  database: `thero`
});

connection.connect();

//PLEASE READ SCHEMA FIRST!

const checkUser = (user, cb) => {
  //search for user in DB
    //if not found, create new user
    //else, retrieve all user's saved data
  connection.query(`SELECT * FROM users WHERE username = ?`, user.username, (err, results) => {
    if (err) {
      return console.error(`Error when trying to query the database to check for dupes when creating a new user: ${err}`);
    }

    console.log(`Hitting the DB! User with username ${user.username} currently ${results ? `does exist, retrieving faves` : `doesn't exist. Hang on! Issuing redirect`}; raw results: ${JSON.stringify(results)}`);   
    
    if (results.length === 0) {
      console.log('creating user');
      createUser(user, cb);
      
    }
    else {
      console.log('checking for faves!');

      let userId = results[0].id;

      //get all saved destinations that belong to a user
      connection.query(`SELECT * FROM saved_destinations WHERE id_users= ${userId}`, (err, destinations) => {
        if (err) { return console.error(`Error in selecting saved destinations: ${err}`); }

        console.log('results from querying saved destinations for matches with userId', JSON.stringify(destinations));
        
        //return an array of destination IDs to use in query (in join table) for user's favorite places
        let destinationIDs = destinations.map((dest) => {
          return dest.id;
        });

        console.log(`destination IDs: ${destinationIDs}`);

        
        const getAllFavorites = (destinationIDs, callback) => {
          let faves = []; //
          Promise.all(destinationIDs.map((eachDest, topLevelMapIdx) => {
            return new Promise((resolve, reject) => {
              //below query finds matching places for a given destination (may return multiple rows)
              connection.query(`SELECT google_id_saved_places, travel_time, distance FROM destination_to_place WHERE id_saved_destination= ${eachDest}; `, (err, matches) => {
                if (err) { return console.error(`Error selecting placeIds with the from join table: ${err}`); }

                // console.log(`Results from retrieving matching placeIds from join table: ${JSON.stringify(matches)}`);

                let googlePlaceIDs = matches.map((match) => {
                  return match.google_id_saved_places; //pull out google_place_ids from the matching row(s) in join table query results
                });

                // console.log(`mapped google place ids: ${googlePlaceIDs}, typeof: ${Array.isArray(googlePlaceIDs)}`);

                let bulkPlaceQuery = googlePlaceIDs.map((google_id) => {
                  return `SELECT * FROM saved_places WHERE google_id= '${google_id}'; `; //create bulk query string by mapping over google_place_ids
                }).join('');

                // console.log(`BULK QUERY from mapped google_ids: ${bulkPlaceQuery}`);

                let travelTimeInfo = matches.map((match) => {
                  return [match.destination, match.travel_time]; //format the travel/distance relationship between a given destination and each of its saved places
                });


                resolve(new Promise((resolve, reject) => {
                  console.log('bet you this runs when we thing it should')

                  connection.query(bulkPlaceQuery, (err, places) => {
                    if (err) { return console.error(`Error selecting places with the filtered google_id from saved_places: ${err}`); }

                    console.log(`Success! All matching place objects for ${eachDest}: ${JSON.stringify(places)}`);

                    let { dest_address, create_time, dest_lat, dest_long, rating } = destinations[topLevelMapIdx]; //destructured fields from a given saved destination


                    let fave = { //package all info corresponding to a saved destination (aka fave)
                      address: dest_address,
                      createdAd: create_time,
                      lat: dest_lat,
                      long: dest_long,
                      rating: rating,
                      places: places.map((place, idx) => { //results from the previous bulk query
                        if (Array.isArray(place)) {
                          place = place[0];
                        }
                        place['travel_time'] = travelTimeInfo[idx][1];
                        place['distance'] = travelTimeInfo[idx][0];
                        return place;
                      })
                    };
                    // console.log('what are pushing to fave', fave)

                    resolve(fave);

                    // console.log('faves on each map iteration', faves

                  });


                }))
              });

                }); 
              
            })).then((vals) => {
              console.log('is faves anything?', vals)
              callback(vals)
            })
          
          
        }

        getAllFavorites(destinationIDs, (savedLocations) => {

          let userData = {
            userData: results, //results is from first query, is a user record (one row from user table)
            savedLocations: savedLocations
          };

          // console.log('results correctly composed FINALLY', results);
          cb(err, userData);

        });

      });


    }
  });
}


const createUser = (user, cb) => {
  connection.query(`INSERT INTO users SET ?`, user, (err, results) => {
    if (err) {return console.error(`error creating new user: ${err}`);}
    
    console.log(`success! new user ${user.username} created!`)
    cb(err, results);
  });
}


const savePrefs = (prefs, cb) => {
  console.log(`prefs obj in savePrefs ${JSON.stringify(prefs)}`);
  let prefQuery = `UPDATE users ?`;
  let prefQuery2 = `UPDATE users SET bank= "${prefs.bank}", grocery_store= "${prefs.grocery_store}", coffee_shop= "${prefs.coffee_shop}", restaurant= "${prefs.restaurant}", gym_membership= "${prefs.gym_membership}", laundromat= "${prefs.laundromat}", liquor_store= "${prefs.liquor_store}", hair_care= "${prefs.hair_care}", convenience_store= "${prefs.convenience_store}", public_transit= "${prefs.public_transit}" WHERE username= "${prefs.username}" ;`  


  connection.query(prefQuery2,
    (err, savedPrefs) => {
      if (err) {return console.error(`err saving new preferences: ${err}`);}

      console.log('DEBUGGING savedPrefs in db helper:', savedPrefs)

      cb(err, savedPrefs);
    });
}

//save new search
const saveDestination = (destination, places, cb) => {

  // console.log('is the username getting passed down?', destination.username);
// console.log(`DEBUGGING: places is ${JSON.stringify(places)}`)
//format date from JS UTC to MYSQL DATETIME
  function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }


  Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
  };

  const storeDestination = `INSERT INTO saved_destinations SET id_users= (SELECT id FROM users WHERE username= '${destination.username}'), dest_address= '${destination.address}', create_time= '${destination.create_time.toMysqlFormat()}';`;
  
  const storePlaces = ` INSERT IGNORE INTO saved_places (type, google_id, place_name, place_address, rating, price_level, thumbnail, category_icon, place_lat, place_long) VALUES ?`;
  // console.log(`date reformat: ${destination.create_time.toMysqlFormat()} typeof: ${typeof destination.create_time.toMysqlFormat()}`)
  // console.log(`multi-line SQL statement: ${storeDestination + storePlaces}`);
  connection.query((storeDestination + storePlaces), [placesInsertionQuery(places)], (err, results) => {
    if (err) {
      return console.error(`Error saving destination: ${err}`);
    } 
      console.log('result from store to saved_places and saved_destinations', results);
      connection.query(`SELECT id FROM saved_destinations WHERE dest_address= '${destination.address}' AND create_time= '${destination.create_time.toMysqlFormat()}'`, (err, result) => {
        //using create time in query so that a destination is unique to a user
        if (err) {return console.error(`error in selecting ID for destination join: ${err}`);}
        let placeIDs = bulkJoinPlaceIds(places); //create array of placeIDs for sql bulk query
        let bulkJoinFKIDs = [];
        
        console.log('result from select ID from desintation table query: ', result[0].id);
        
        places.forEach((place, idx) => {
          bulkJoinFKIDs.push([result[0].id, placeIDs[idx], places[idx].distance, places[idx].travel_time]);
          //result[0].id is saved destination id, placeIDs[idx] is place id index; rest are props of places object being formatted into an array for bulk insert in join table
        })

        console.log('mapped out bulkJoin IDs', bulkJoinFKIDs);

        connection.query(`INSERT INTO destination_to_place (id_saved_destination, google_id_saved_places, distance, travel_time) VALUES ?;`, [bulkJoinFKIDs], (err, results) => {
          if (err) {return console.error(`Error saving destination/places in join table: ${err}`);}
          cb(err, results);
        });

      } )
  });

  // connection.query(storePlaces, [placesInsertionQuery(places)], (err, results) => {
  //   cb(err, results);
  // })
}

const placesInsertionQuery = (places) => { //helper function for save destination

  const bulkInsertParams = places.reduce((formattedArr, place) => {
    let row = [];
    
    for (key in place) {
      if (!(key === "travel_time" || key === "distance")) {
        // console.log(`keys in bulk insertion formatting: ${key}`);
        row.push(place[key]);
      }
    }

    formattedArr.push(row);
    
    return formattedArr;
  }, []);

  // console.log(`bulkInsertParams ${bulkInsertParams}`);

  return bulkInsertParams;
}

const bulkJoinPlaceIds = (places) => {
  let placeIds = places.map((place) => {
    return place.google_id;
  });

  console.log('place ids after mapping:', placeIds);
  return placeIds;
}

module.exports.createUser = createUser;
module.exports.saveDestination = saveDestination;
module.exports.checkUser = checkUser;
module.exports.savePrefs = savePrefs;
