// import fetch from 'node-fetch'; // ensure node-fetch is installed
// import fs from 'fs'; // Node file system module
// import dotenv from 'dotenv'; // Load environment variables from .env

// dotenv.config();

const apiKey = "9980c216012010b2c3b542aab3058039";
if (!apiKey) {
  throw new Error("API_SPORTS_KEY environment variable is not set");
}

var myHeaders = new Headers();
myHeaders.append("x-apisports-key", apiKey);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

let getFormattedDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate() + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
let SUPPORTED_LEAGUES_IDS = [1, 2, 3, 6, 8, 12, 19, 20, 29, 30, 31, 32, 33, 34, 37, 39, 45, 48, 61, 66, 78, 135, 137, 140, 143, 307, 490, 587, 848, 920, 1186]



let formattedDate = getFormattedDate();
fetch(`https://v3.football.api-sports.io/fixtures?date=${formattedDate}`, requestOptions)
  .then(response => response.json()) // parse JSON instead of text
  .then(data => {
    // Filter fixtures to include only supported leagues
    data.response = data.response.filter(fixture => SUPPORTED_LEAGUES_IDS.includes(fixture.league.id));
    data.response.forEach(element => {
      let date = new Date(element.fixture.date);
      console.log(`${element.league.name} - ${element.teams.home.name} vs ${element.teams.away.name} - Kickoff: ${date.getHours()}:${date.getMinutes()}`);
    });
    // write JSON to a file
    fs.writeFile("fixtures.json", JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Data saved to fixtures.json");
      }
    });
  })
  .catch(error => console.log('error', error));
