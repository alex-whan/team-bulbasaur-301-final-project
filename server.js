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

// Show details for a book
app.get('/collection/:id', showDetails);

// Delete show from collection route
app.delete('/collection/:id', deleteShowFromCollection);

//Delete show from recommendations
app.delete('/recommendations/:id', deleteShowFromRecommendations);

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
        let responseArray = results.body.results;
        res.status(200).render('pages/results.ejs', { shows: responseArray, query: query });
      } else {
        res.status(200).render('pages/no-results.ejs', { query: query });
      }
    }).catch(err => console.log(err));
}

// Show details handler
function showDetails(req, res) {
  const title = req.query.title;
  const tmdbId = req.query.id;
  const image_url = req.query.image_url;
  trakt.search.id({
    id: tmdbId,
    id_type: 'tmdb',
    extended: 'full',
    type: 'show'
  }).then(response => {
    let url = 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup';
    let queryParams = {
      'country': 'US',
      'source_id': tmdbId,
      'source': 'tmdb'
    };
    superagent.get(url, queryParams)
      .set({ 'x-rapidapi-host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com' })
      .set({ 'x-rapidapi-key': process.env.RAPID_API_KEY })
      .set({ 'useQueryString': true })
      .then(results => {
        let platforms = results.body.collection.locations
          .map(location => {
            return location.display_name.replace('IVAUS', '');
          });
        let showData = new Show(response.data[0].show, image_url, tmdbId, platforms);
        res.status(200).render('pages/detail.ejs', { show: showData })
      }).catch(() => {
        let platforms = [];
        if (response.data[0]) {
          let showData = new Show(response.data[0].show, image_url, tmdbId, platforms);
          res.status(200).render('pages/detail.ejs', { show: showData })
        } else {
          let platforms = [];
          let constructorObj = { title: title, ids: {}};
          let showData = new Show(constructorObj, image_url, tmdbId, platforms);
          res.status(200).render('pages/detail.ejs', { show: showData })
        }
      }).catch(err => {
        console.log(err);
      })
  }).catch(err => console.log(err))
}

// Add show to collection handler
function addShowToCollection(req, res) {
  let idCheck = 'SELECT * FROM series WHERE tmdbId=$1;';
  let idSafeValue = [req.body.tmdbId];
  client.query(idCheck, idSafeValue)
    .then(idResults => {
      if (idResults.rowCount < 1) {
        let { title, overview, image_url, genres, rating, available_translations, year, tmdbId, platforms, traktId } = req.body;
        let sql = 'INSERT INTO series (title, overview, image_url, genres, rating, available_translations, year, tmdbId, platforms, traktid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING traktid;';
        let safeValues = [title, overview, image_url, genres, rating, available_translations, year, tmdbId, platforms, traktId];
        client.query(sql, safeValues)
          .then((sqlResults) => {
            let idForRuntime = sqlResults.rows[0].traktid;
            if(idForRuntime) {
              getLength(idForRuntime);
            }
          })
          .then(() => {
            res.status(200).redirect('/collection');
          }).catch(error => console.log(error))
      } else {
        res.status(200).redirect('/collection');
      }
    }).catch(error => console.log(error))
}

// Collection Page
function collectionPage(req, res) {
  let sql = 'SELECT * FROM series;';
  client.query(sql)
    .then(sqlResults => {
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

// Delete show from recommendations
function deleteShowFromRecommendations(req, res) {
  let showId = req.params.id;
  let sql = 'DELETE FROM series WHERE id=$1;';
  let safeVales = [showId];
  client.query(sql, safeVales)
    .then(() => {
      res.status(200).redirect('/recommendations')
    }).catch(error => console.log(error));
}

// Render recommendation page
function recommendationPage(req, res) {
  let sql = 'SELECT * FROM series;';
  client.query(sql)
    .then(sqlResults => {
      let favorites = sqlResults.rows;
      res.status(200).render('pages/recommendations.ejs', { favoritesArray: favorites });
    }).catch(error => console.log(error))
}

// Save a comment and render recommendation page
function saveComment(req, res) {
  let id = req.body.id;
  let comments = req.body.comments
  let usernames = req.body.usernames
  while (comments.includes(',,,,,,,,')) {
    comments = comments.split(',,,,,,,,').join(',,,,,,,')
  }
  while (usernames.includes(',,,,,,,,')) {
    usernames = usernames.split(',,,,,,,,').join(',,,,,,,')
  }
  let sql = 'SELECT * FROM series WHERE id = $1;';
  let safeValue = [id];
  client.query(sql, safeValue)
    .then(results => {
      if (results.rows[0].comments) {
        comments = results.rows[0].comments + ' ,,,,,,,, ' + comments;
        usernames = results.rows[0].usernames + ' ,,,,,,,, ' + usernames;
      }
      let sql = 'UPDATE series SET comments = $1, usernames = $2 WHERE id = $3 RETURNING usernames;';
      let safeValues = [comments, usernames, id]
      client.query(sql, safeValues)
        .then(sqlResults => {
          res.status(200).redirect('/recommendations');
        }).catch(err => console.log(err));
    })
}

// TV show constructor
function Show(obj, img, tmdbId, platforms) {
  this.title = obj.title ? obj.title : 'No title available.';
  this.overview = obj.overview ? obj.overview : 'No overview available.';
  this.image_url = img ? img : 'Image not available.';
  this.genres = obj.genres ? obj.genres.join(', ') : 'Genres not available';
  this.rating = obj.rating ? (obj.rating).toFixed(1) : 'Rating not available';
  this.available_translations = obj.available_translations ? obj.available_translations.join(', ').toUpperCase() : 'Translations not available';
  this.year = obj.year ? obj.year : 'Year not available';
  this.tmdbId = tmdbId;
  this.traktId = obj.ids.trakt ? obj.ids.trakt : '';
  this.platforms = platforms ? platforms.join(', ') : 'Platforms not available';

}

// Gets the length of a TV series
function getLength(num) {
  let runtime = 0;
  trakt.seasons.summary({
    id: num,
    type: 'tmdb',
    extended: 'full'
  }).then(response => {
    const episodesPerSeason = response.data.reduce((acc, season) => {
      if (parseInt(season.number) > 0) {
        acc.push(season.episode_count);
        return acc;
      }
      return acc;
    }, []);
    episodesPerSeason
      .forEach((numEpisodes, index) => {
        for (let i = 1; i < numEpisodes + 1; i++) {
          trakt.episodes.summary({
            season: index + 1,
            episode: i,
            id: num,
            type: 'tmdb',
            extended: 'full'
          }).then(response => {
            runtime += response.data.runtime;
            let sql = 'UPDATE series SET runtime = $1 WHERE traktid = $2 RETURNING runtime;';
            let safeValue = [runtime, num];
            client.query(sql, safeValue)
              .then(sqlResults => {
              }).catch(err => console.log(err))
          }).catch(err => console.log(err))
        }
      })
  })
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




