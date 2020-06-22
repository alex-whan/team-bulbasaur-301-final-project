# Software Requirements

## Vision

There are an overwhelming number of series available on multiple streaming platforms, making choosing what to watch difficult. This application makes it easier to decide on what series/show a user is going to watch, as it gives them valuable information up front that makes the decision as to what to watch simpler. This way users can identify ahead of time which series is right for them based off of the time required to finish the series (overall time, number of seasons, etc).

## Scope

### This Application Will:

* The web app will allow users to search for series by title, genre, and the streaming platform on which they are available.

* The web app will display results of searches populated with real data from APIs and/or the connected database (including series length, rating, platform, and other related information).

* The web app will allow users to save series in on "collection" page to keep track of series they enjoy or are interested in watching.

* Users will be able to share their favorites to a recommendation page, through which they can leave comments and recommendation votes on each saved series.

* Users will be able to view comments and recommendations on series from other users when search results are displayed for a given series.

* Users can delete saved series from their collection, and this will also delete saved series from the appropriate storage.

### This Application Will Not:

* This web app will not host any series streaming itself.

* This web app will not be made into a mobile application for Android or iOS.

### Minimum Viable Product (MVP)

The MVP for this application is as follows:

1. User searches for a series, and the application makes an API call to a movie/series database to retrieve information about the show.

1. Users can add a series to a “favorites” page, which will save the details to a database. Users can later retrieve this information from a database when accessing their “favorites”.

1. Saved series will have a comments section where users can put their notes and feedback about each series, and choose to “recommend” or “not recommend” when submitting their comments. These “votes” and comments will then be attached to the appropriate series and displayed to other users

1. Users will have the ability to delete a series from their “favorites” page. This will also delete that entry from the connected database.

1. User interface will have a clean and intuitive layout based on mobile-first design concepts.

### Stretch Goals

* Change search language for series (or series with subtitles, etc)

* Visualization of ratings

* Calculator to determine how long a user would need to finish an entire series when watching for different amounts of time each day

* Login and authentication system for users to keep track of their saved series/recommendations from any machine.

## Functional Requirements

### Data Flow

The user will search for a series by title, genre, or streaming platform. The application will send this information to the back-end, at which point the back-end calls to the APIs to search for matching information on a series. The matching information from the request will be sent all the way back to the front end in the response, and the user will be able to see the search results. The user will be able to see basic series information (image, title, etc), and then given an option to continue to a "more details" page to retrieve more information using a second API call. Users can then add a series to their saved collection and/or recommend it by leaving a comment and recommendation. At this point, saved series would be put into the application database for future retrieval to limit continuous API calls. Comments and recommendations will be saved to the database as well, and this information will be rendered alongside future search results involved that specific series.

## Non-Functional Requirements

1. Maintainability: This application will feature clean and well-maintained code that is designed to be easily human-readable, semantic, and simple to adjust if needed. We will separate our HTTP route references into routes and their associated callback functions for better readability and organization, as well as better repeatability when adding or modifying routes. We will also utilize templating and partials with EJS to reduce code clutter and write code that features DRY principles.

2. Usability: This application will utilize responsive web design based on mobile-first design principles to allow users to access this application on different devices and screen sizes. The application will be optimized for phone, tables, and desktop browser versions using media queries. It will also use a combination of flex and grid designs in the CSS styling.
