# Code Fellows - Code 301 Final Project - Team Bulbasaur

# Scuba TV
## We take a deep dive into the shows you want!

![GitHub](https://img.shields.io/github/license/alex-whan/team-bulbasaur-301-final-project)
[![Build Status](https://travis-ci.com/alex-whan/team-bulbasaur-301-final-project.svg?branch=development)](https://travis-ci.com/alex-whan/team-bulbasaur-301-final-project)

**Authors:**

* Lulu Sevignon
* Josh Williams
* Kamit Satkeev
* Alex Whan

**Version:** 1.3.0

* View the deployed site for **Scuba TV** here: https://scuba-tv.herokuapp.com/

## Overview

There are an overwhelming number of series available on multiple streaming platforms, making choosing what to watch difficult. This application makes it easier to decide on what series/show a user is going to watch, as it gives them valuable information up front that makes the decision as to what to watch simpler. This way users can identify ahead of time which series is right for them based off of the time required to finish the series (overall time, number of seasons, etc).

## Getting Started

**Step 1:**

Open your command line and clone the repo down from GitHub:

    $ git clone https://github.com/alex-whan/team-bulbasaur-301-final-project.git

**Step 2:**

Once the repo has been cloned, create a `.env` file as follows:

    $ npm i
    $ touch . env

**Step 3:**

Next, we need to set up our Postgres database. From the root directory of the application, run the following commands in command line:

    $ psql

    # CREATE DATABASE scuba_tv;
    # \q

    $ psql -d scuba_tv -f data/schema.sql
    $ psql -d scuba_tv -f data/seed.sql

**Step 4:**

You'll need to request several **API Keys** in order to run this application locally. These API keys will be needed in the `.env` file in the next step. 

Please visit the following sites, register if needed, and follow site instructions for requesting API keys from each one. Please note that it could take some time for the keys to be sent to you after registering.

* [The Movie Database API (TMDb)](https://developers.themoviedb.org/3/getting-started/introduction)
  - Click the link titled *"API link"* to register for your API key.

* [Trakt.TV API](https://trakt.docs.apiary.io/#introduction/create-an-app)
  - Scroll down to the *"Create an App"* section and follow the first link there.
  - Do not worry about your API's name, icon, description, redirect URL, or JavaScript origins. You can simply use whichever filler information you wish.
  - Note: You will need **both** the *"Client ID"* and *"Client Secret* keys in this application.
  - [This link](https://koditips.com/create-trakt-api-key-kodi-addon/) provides excellent instructions in case you get stuck.

* [uTelly RapidAPI](https://rapidapi.com/utelly/api/utelly)
  - On the linked page, navigate to the *"Pricing"* tab near the top. Don't worry - you won't have to pay for this service.
  - On the *"Pricing"* page, click *"Select Plan"* for the *"Basic"* option, and proceed with registration to receive your API key.

**Step 5:**

Open the `.env` file and insert the following code:

    PORT=[insert open port here]
    DATABASE= see below note!
    RAPID_API_KEY=[your uTelly/RapidAPI key here]
    TMDB_URL=[your TMDB key here]
    TRAKT_ID=[your Trakt Client ID key here]
    TRAKT_SECRET=[your Trakt Secret ID key here]

Make sure that there are **NO** spaces between the `=` and your key - the key should follow immediately after the "equals" sign.

Note on PORT:
* You will need to designate an open port on your machine on which this app will run. Try `3000` or `3001`, as these are often open.

Note on DATABASE: 
* Make sure that the `db_name` you created in Step 3 is the same one that you use to pair with `DATABASE=` in this step.
* The DATABASE URL you use in this step will differ for MacOS and Windows users:
  - For **MacOS**: use `postgres://localhost:5432/scuba_tv`
  - For **Windows**: use `DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/scuba_tv` and replace `USERNAME:PASSWORD` with your Postgres username and password, respectively.

Note on API Keys:
* These keys will need to match up exactly with those you received in the previous step. Make sure to copy and paste them in to avoid errors.

**Step 6:**

Nearly there! All that's left to do now is fire up the server. Run the following command in your terminal:

    $ npm start

At this point, you should be able to search for TV shows in Scuba TV's search feature, save them into your local database Collection, and leave commments on those shows in your collection. As long as you do not clear the database with a `DROP TABLE` command in `psql`, you selections will remain saved unless you choose to manually delete them in the app. Happy browsing!

## Architecture

The back end of this application is built on an Express server, and uses Superagent for making API calls to the Trakt.tv, RapidAPI/uTelly, and The Movie Database (TMDb) APIs. Postgres stores data in a database, and uses SQL to query stored information from the database to populate the user Collection and Comments to avoid excess API calls. The front end of the application is created using tje EJS (Embedded JavaScript) templating library for views and partials.

### A list of all dependencies required to run this program:

  * cors
  * dotenv
  * EJS
  * Express
  * method-override
  * pg
  * superagent
  * trakt.tv
  * unirest

### Domain Modelling

![Web Request Response Cycle](./public/assets/images/project-wrrc.png)

### CRUD:
* Create (Post) - Add series to favorites/database
* Read (Get) - Getting routes
* Update (Put) - Comment updates
* Delete (Delete) - Delete from favorites/database

### Database Entity Relationship Diagram

![Database Entity Relationship Diagram](./public/assets/images/project-erd.jpg)

### Application Wireframe

![Wireframe 1](./public/assets/images/wireframe-1.jpg)
![Wireframe 2](./public/assets/images/wireframe-2.jpg)
![Wireframe 3](./public/assets/images/wireframe-3.jpg)
![Wireframe 4](./public/assets/images/wireframe-4.jpg)
![Wireframe 5](./public/assets/images/wireframe-5.jpg)
![Wireframe 6](./public/assets/images/wireframe-6.jpg)
![Wireframe 7](./public/assets/images/wireframe-7.jpg)

## Links and Important Resources

* [Trello Project Management Board](https://trello.com/b/b31pfDlT/bulbasaur)

* Project Preparation Documents
  - [Software Requirements](./md/requirements.md)
  - [Conflict & Communication Plan](./md/conflict-communication.md)
  - [Work Plan & Git Flow](./md/work-git.md)