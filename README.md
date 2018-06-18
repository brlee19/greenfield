![image](https://i.imgur.com/jCU3fcn.png)

# HRNYC14 Greenfield: TravelHero

##### intro

Travelling is fun. But also stressful. With TravelHero, you can find home home anywhere. Where’s my bank :bank: ?  I’ve got a meeting in five hours and I need a fresh cut :haircut:!  I need to do laundry :shirt:!!! Don’t sweat it, we’ve got you covered. Just set your preferences and get livin’.

##### authors

* Ana Vasquez [@anavasquez08](https://github.com/anvasquez08)
* Brian Lee [@brlee19](https://github.com/brlee19)
* Rahul Krish [@rksquared](https://github.com/rksquared)

##### tech stack

* React, React Router, Material UI
* Node.js, Express, MySQL
* Google Geocoding, Google Places, Google Maps Distance Matrix APIs

##### organization

* helpers/google.js contains Google API functions

* helpers/dbHelpers.js interacts with the mySQL database

* helpers/utils.js converts data that the React frontend sends to the server to the format that the server uses to make requests to Google. Files that facilitate communication between different parts of the app can go here.

##### opportunities to improve the project

* improve signup page and add user authentication
* make a call to Google Maps API to plot search results on map
* finish any remaining functionality to render user favorite places
* implement Google OAuth to save favorite places on user's Google Maps