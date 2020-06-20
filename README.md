# Code Fellows - Code 301 Final Project - Team Bulbasaur

**Authors:**

* Lulu Sevignon
* Josh Williams
* Kamit Satkeev
* Alex Whan

**Version:** 1.0.0

## Overview

There are an overwhelming number of series available on multiple streaming platforms, making choosing what to watch difficult. This application makes it easier to decide on what series/show a user is going to watch, as it gives them valuable information up front that makes the decision as to what to watch simpler. This way users can identify ahead of time which series is right for them based off of the time required to finish the series (overall time, number of seasons, etc).

### This Application Will:

* Generate movie or series ideas: Enter a series/something about a series, then it tells you what streaming services it’s on (could tell you how long it might take to watch a whole series), and what the ratings are.

* Other features:
  - Search for a specific series name
  - Search by Actor/Director
  - Search by Genre
  - Need to be able to see what streaming services it’s on
  - Series randomizer (select by genre, other indicator)
  - Have a favorites list that users can save, update, delete
  - Comment/notes and "recommended" votes to save with the movies


## Getting Started

A list of all dependencies required to run this program:

## Architecture

### CRUD:
* Create (Post) - Add series to favorites/database
* Read (Get) - Getting routes
* Update (Put) - Comment updates
* Delete (Delete) - Delete from favorites/database

## MVP

The MVP for this application is as follows:

1. User searches for a series, and the application makes an API call to a movie/series database to retrieve information about the show.

1. Users can add a series to a “favorites” page, which will save the details to a database. Users can later retrieve this information from a database when accessing their “favorites”.

1. Saved series will have a comments section where users can put their notes and feedback about each series, and choose to “recommend” or “not recommend” when submitting their comments. These “votes” and comments will then be attached to the appropriate series and displayed to other users

1. Users will have the ability to delete a series from their “favorites” page. This will also delete that entry from the connected database.

1. User interface will have a clean and intuitive layout based on mobile-first design concepts.

## Stretch Goals

* Change search language for movies (or movies with subtitles, etc)

* Visualization of ratings

* Calculator to determine how long a user would need to finish an entire series when watching for different amounts of time each day

## Credits and Collaborations

## Links and Important Resources

* [Trello Project Management Board](https://trello.com/b/b31pfDlT/bulbasaur)

* Project Preparation Documents
  - [Conflict & Communication Plan](./md/conflict-communication.md)
  - [Work Plan & Git Flow](./md/work-git.md)