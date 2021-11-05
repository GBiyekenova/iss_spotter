// // iss.js
 const request = require('request');

// /**
//  * Makes a single API request to retrieve the user's IP address.
//  * Input:
//  *   - A callback (to pass back an error or the IP string)
//  * Returns (via Callback):
//  *   - An error, if any (nullable)
//  *   - The IP address as a string (null if error). Example: "162.245.144.188"
//  */
//  const fetchMyIP = function(callback) {
//   request('https://api.ipify.org?format=json', (error, response, body) => {
//     if (error) return callback(error, null);

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }

//     const ip = JSON.parse(body).ip;
//     callback(null, ip);
//   });
// };

// module.exports = { fetchMyIP };
// ///////
// const fetchCoordsByIP = function(ip, callback) {
//   request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
//       return;
//     }

//     const { latitude, longitude } = JSON.parse(body);

//     callback(null, { latitude, longitude });
//   });
// };

// // Don't need to export the other function since we are not testing it right now.
// module.exports = { fetchCoordsByIP };
// ////
// const fetchISSFlyOverTimes = function(coords, callback) {
//   const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

//   request(url, (error, response, body) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
//       return;
//     }

//     const passes = JSON.parse(body).response;
//     callback(null, passes);
//   });
// };

// // Don't need to export the other functions since we are not testing them right now.
// module.exports = { fetchISSFlyOverTimes };
// ////
// const nextISSTimesForMyLocation = function(callback) {
//   fetchMyIP((error, ip) => {
//     if (error) {
//       return callback(error, null);
//     }

//     fetchCoordsByIP(ip, (error, loc) => {
//       if (error) {
//         return callback(error, null);
//       }

//       fetchISSFlyOverTimes(loc, (error, nextPasses) => {
//         if (error) {
//           return callback(error, null);
//         }

//         callback(null, nextPasses);
//       });
//     });
//   });
// };

// // Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// // This is because they are not needed by external modules.
// module.exports = { nextISSTimesForMyLocation };


// const fetchMyIP = function(callback) {
//   request('https://api.ipify.org?format=json', (error, response, body) => {
//     if (error) return callback(error, null);

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }

//     const ip = JSON.parse(body).ip;
//     callback(null, ip);
//   });
// };

// nextISSTimesForMyLocation(fetchMyIP(fetchCoordsByIP(fetchISSFlyOverTimes())))


const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  const url = "https://api.ipify.org?format=json";
  request(url, (error, response, body)=>{
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let resp = JSON.parse(body);
    //callback(null, resp.ip)
    fetchCoordsByIP(resp.ip, callback)
  }) 
}

const fetchCoordsByIP = function(ip, callback) {
  const API_Key = "6c9a8e50-3ddd-11ec-a1e9-9d35add64c7e";
  const geo_url =`https://api.freegeoip.app/json/${ip}?apikey=${API_Key}`;
  request(geo_url, (error, response, body)=>{
    if (error) {
      callback(error, null);
      return;
    }
    if(response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let coords = JSON.parse(body);
    fetchISSFlyOverTimes({latitude: coords.latitude, longitude: coords.longitude}, callback)
  })
}

const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  let urlS = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`
  request(urlS, (error, response, body)=>{
    if (error) {
      callback(error, null);
      return;
    }
    if(response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //console.log(body);
    let riseDur = JSON.parse(body);
    //console.log(riseDur);
    callback(null, riseDur.response);
    //({latitude: coords.latitude, longitude: coords.longitude})
  })
};
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP(callback)
  // empty for now

}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };