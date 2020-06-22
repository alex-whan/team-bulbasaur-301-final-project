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
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));



const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

const PORT = process.env.PORT || 3001;

app.get('/', goHome)

function goHome (req,res) {
  res.status(200).render('pages/index.ejs');
}




client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  }).catch(err => console.log(err));






