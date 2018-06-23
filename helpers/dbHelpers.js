const mysql = require('mysql');

const connection = mysql.createConnection({
  multipleStatements: true,
  user: 'root',
  database: 'thero',
});

connection.connect();

const dbQuery = (queryStr, args) => {
  return new Promise((resolve, reject) => {
    connection.query(queryStr, args, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const createUser = async (user) => {
  return dbQuery('insert into users set ?', user);
};

const getUserDestinations = async (userId) => {
  return dbQuery('select * from saved_destinations where id_users = ?', userId);
};

const getUserPlaces = async (destinationIds) => {
  const queryStr = `
    select *
    from saved_places as p
    inner join destination_to_place as d2p
    on p.google_id = d2p.google_id_saved_places
    where d2p.id_saved_destination in ('${destinationIds.join()}')
  `;
  return dbQuery(queryStr);
};

const getUserSavedData = async (userId) => {
  const savedDestinations = await getUserDestinations(userId);
  const destIds = savedDestinations.map(row => row.id);
  const savedPlaces = await getUserPlaces(destIds);
};

const getPrefs = async (user) => {
  try {
    const userLookup = await dbQuery('SELECT * FROM users WHERE username = ?', user.username);
    const userDoesExist = userLookup.length;
    if (userDoesExist) {
      return {
        userData: userLookup[0], // make sure no dupe usernames allowed
        places: await getUserSavedData(userLookup[0].id),
      };
    }
    return 'user does not exist';
  } catch (e) {
    console.error('error trying to check or create user', e);
  }
};

// const savePrefs = async (prefs) => {

// }

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
module.exports.getPrefs = getPrefs;
module.exports.savePrefs = savePrefs;
