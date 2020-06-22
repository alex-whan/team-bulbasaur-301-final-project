'use strict';


// Libraries
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();
const app = express();
const cors = require('cors');
const methodOverride = require('method-override');

const unirest = require('unirest');
// Trakt Set Up
const Trakt = require('trakt.tv');
let options = {
  client_id: process.env.TRAKT_ID,
  client_secret: process.env.TRAKT_SECRET,
  redirect_uri: null,
  api_url: null,
  useragent: null,
  pagination: true,
  debug: true,
  limit: 15
};
const trakt = new Trakt(options);

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));



const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

const PORT = process.env.PORT || 3001;

app.get('/', goHome);
app.get('/search/new', searchShows)

function goHome(req, res) {
  res.status(200).render('pages/index.ejs');
}

function searchShows(req, res) {
  trakt.search.text({
    query: 'parks and recreation',
    type: 'show,person',
    extended: true
  }).then(response => {
    // use this to get the id, not great at searching for actors
    // console.log(response.data);
    // console.log('trakt imdb', response.data[0].show.ids.imdb);
    // use this to get tv show length
    const id = response.data[0].show.ids.imdb;
    trakt.episodes.summary({
      // loop through all episodes
      id: id,
      id_type: 'imdb',
      season: 1,
      episode: 5,
      extended: 'full'
    }).then(response => {
      console.log(response.data);
    })
    trakt.shows.summary({
      id: id,
      id_type: 'trakt',
      extended: 'full'
    }).then(response => {
      // response.data.overview
      // response.data.ratings
      // reponse.data.genres (array)
      // response.data.translations (array)
      // response.data.title
      // response.data.year
      // console.log(response.data);
    })
  }).catch(err => console.log(err))

  uTellyCall();
}

function uTellyCall() {
  let req = unirest('GET', 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup');
  req.query({
    'term': 'parks and recreation',
  });
  req.headers({
    'x-rapidapi-host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'useQueryString': true
  });
  req.end(function (res) {
    // tells you where you can find the tv show, eg netfilx google play
    // console.log(res.body.results);
    // get imdb id: res.body.results[0].external_ids.imdb.id 
    // res.body.results.picture
    // loop through location to get all of them
    // res.body.results[0].locations[0].display_name
    // res.body.results[0].locations[0].icon
    // res.body.results[0].locations[0].url


    // Get imdb from utelly, use for trakt search
  });
}



client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  }).catch(err => console.log(err));






