'use strict';

// Libraries and Dependencies
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
const { response } = require('express');
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


// Turn on/establish client
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

// Initialize port
const PORT = process.env.PORT || 3001;

// Routes
// Home route
app.get('/', goHome);

// Search results route
app.get('/search', renderSearchPage);

// New search route
app.get('/search/new', searchShows);

// Show details route
app.get('/details', showDetails);

// aboutUs route
app.get('/aboutUs', aboutUs);

// Add show to collection route
app.post('/collection', addShowToCollection);

// collection page route
app.get('/collection', collectionPage);

app.get('/collection/:id', showDetails);

// Delete show from collection route
app.delete('/collection/:id', deleteShowFromCollection);

// recommendation page
app.get('/recommendations', recommendationPage)

// add comments to recommendations
app.put('/comment', saveComment)

// 404 error route
app.use('*', notFound);

// Home route handler
function goHome(req, res) {
  res.status(200).render('pages/index.ejs');
}

// Search page handler
function renderSearchPage(req, res) {
  res.status(200).render('pages/search.ejs');
}

// About Us page handler
function aboutUs(req, res) {
  res.status(200).render('pages/aboutUs.ejs');
}

// Get search results handler
function searchShows(req, res) {
  let query = req.query.search;
  const url = 'https://api.themoviedb.org/3/search/tv';
  const queryParams = {
    api_key: process.env.TMDB_URL,
    query: query
  }
  superagent.get(url, queryParams)
    .then(results => {
      if (results.body.results.length !== 0) {
        console.log('THESE ARE RESULTS :', results.body.results);
        let responseArray = results.body.results;
        res.status(200).render('pages/results.ejs', { shows: responseArray });
      } else {
        console.log('NO RESULTS', results.body.results);
        res.status(200).render('pages/no-results.ejs');
      }
    }).catch(err => console.log(err));
}


// Put some logic into show details page saying "if req.params is TRUE, I don't want to do my search, I want to render my detail page using that param id. If not, then I want it to do everything else it was already doing."
// Similar logic to city explorer to check db for location and save it if you didn't have it yet
// Similar logic saving a book in Book App
// Basically, controlling API call while using similar function at same time.

// Show details handler
function showDetails(req, res) {
  // if(req.params > 0){
  //   console.log('OUR REQUEST PARAMS: ', req.params[0]);

  //   let sql = 'SELECT * FROM series WHERE id=$1;';
  //   let safeValues = [req.params];
  //   client.query(sql, safeValues)
  //     .then(sqlResults => {
  //       console.log('SQL RESULTS :', sqlResults.rows);
  //       res.status(200).render('pages/detail.ejs', { show: sqlResults.rows[0] })
  //     }).catch(error => console.log(error));
  // } else {

  const tmdbId = req.query.id;
  const image_url = req.query.image_url;
  // console.log(req.query);
  trakt.search.id({
    id: tmdbId,
    id_type: 'tmdb',
    extended: 'full',
    type: 'show'
  }).then(response => {
    // console.log('THIS IS OUR RESPONSE DATA: ', (response.data[0].show));
    let showData = new Show(response.data[0].show, image_url, tmdbId);
    // console.log('constructed show', showData);
    res.status(200).render('pages/detail.ejs', { show: showData })
  }).catch((err) => {
    console.log(err);
    res.status(200).render('pages/error.ejs').catch(err => console.log(err));
  });
}
// }

// Add show to collection handler
function addShowToCollection(req, res) {
  let idCheck = 'SELECT * FROM series WHERE tmdbId=$1;';
  let idSafeValue = [req.body.tmdbId];
  // console.log('We are in the addShowFunction');
  client.query(idCheck, idSafeValue)
    .then(idResults => {
      if (!idResults.rowCount) {
        // console.log( 'this is my id Results', idResults.rowCount)
        let { title, overview, image_url, genres, rating, available_translations, year, tmdbId } = req.body;
        let sql = 'INSERT INTO series (title, overview, image_url, genres, rating, available_translations, year, tmdbId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;';
        let safeValues = [title, overview, image_url, genres, rating, available_translations, year, tmdbId];

        client.query(sql, safeValues)
          .then((sqlResults) => {
            // console.log('THIS IS MY SQL RESULTS: ', sqlResults);
            // let id = sqlResults.rows[0].id;
            res.status(200).redirect('/collection');
          }).catch(error => console.log(error))
      }
    }).catch(error => console.log(error))
}

// Collection Page
function collectionPage(req, res) {
  let sql = 'SELECT * FROM series;';
  client.query(sql)
    .then(sqlResults => {
      // console.log(' this is my sqlResults', sqlResults.rows);
      let favorites = sqlResults.rows;
      res.status(200).render('pages/collection.ejs', { favoritesArray: favorites });
    }).catch(error => console.log(error))
}

// Delete show from collection handler
function deleteShowFromCollection(req, res) {
  let showId = req.params.id;

  let sql = 'DELETE FROM series WHERE id=$1;';
  let safeVales = [showId];

  client.query(sql, safeVales)
    .then(() => {
      res.status(200).redirect('/collection')
    }).catch(error => console.log(error));
}


//   trakt.episodes.summary({
//     // loop through all episodes
//     id: id,
//     id_type: 'imdb',
//     season: 1,
//     episode: 5,
//     extended: 'full'
//   }).then(response => {
//     // console.log(response.data);
//   })
// }).catch(err => console.log(err))

// uTelly API call
function uTellyCall(query) {
  let req = unirest('GET', 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup');
  req.query({
    'country': 'US',
    'source_id': query,
    'source': 'imdb'
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
function recommendationPage(req, res) {
  let sql = 'SELECT * FROM series;';
  client.query(sql)
    .then(sqlResults => {
      let favorites = sqlResults.rows;
      res.status(200).render('pages/recommendations.ejs', { favoritesArray: favorites });
    }).catch(error => console.log(error))
}

function saveComment(req, res) {
  console.log(req.body);
  let id = req.body.id;
  let comments = req.body.comments
  let usernames = req.body.usernames
  while (comments.includes(',,,,,,,,')) {
    comments = comments.split(',,,,,,,,').join(',,,,,,,')
  }
  while (usernames.includes(',,,,,,,,')) {
    usernames = usernames.split(',,,,,,,,').join(',,,,,,,')
  }
  console.log('usernames', usernames)
  let sql = 'SELECT * FROM series WHERE id = $1;';
  let safeValue = [id];
  client.query(sql, safeValue)
    .then(results => {
      if (results.rows[0].comments) {
        comments = results.rows[0].comments + ' ,,,,,,,, ' + comments;
        usernames = results.rows[0].usernames + ' ,,,,,,,, ' + usernames;
        console.log(usernames)
      }
      let sql = 'UPDATE series SET comments = $1, usernames = $2 WHERE id = $3 RETURNING usernames;';
      let safeValues = [comments, usernames, id]
      client.query(sql, safeValues)
        .then(sqlResults => {
          console.log('in second SQL statement', sqlResults.rows[0].usernames)
          res.status(200).redirect('/recommendations');
        }).catch(err => console.log(err));
    })
}

function Show(obj, img, tmdbId) {
  this.title = obj.title ? obj.title : 'No title available.';
  this.overview = obj.overview ? obj.overview : 'No overview available.';
  this.image_url = img ? img : 'Image not available.';
  this.genres = obj.genres.join(', ') ? obj.genres.join(', ') : 'Genres not available';
  this.rating = (obj.rating).toFixed(1) ? (obj.rating).toFixed(1) : 'Rating not available';
  this.available_translations = obj.available_translations.join(', ') ? obj.available_translations.join(', ') : 'Genres not available';
  this.year = obj.year ? obj.year : 'Year not available';
  this.tmdbId = tmdbId;
}

// 404 Not Found error handler
function notFound(req, res) {
  res.status(404).send('Sorry, this route does not exist.');
}

// Turn on client and turn on server if client connects
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  }).catch(err => console.log(err));




