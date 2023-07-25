Project Image
![Project Image](./images/top53.jpeg)

## About
Welcome to Top5, a web application that allows users to register, create their top 5 favorite movies list, and explore or comment on other users' top lists.

## Deployment
You can play the game [here]

## Installation Guide
Fork this repo
Clone this repo
$ cd portfolio-back
$ npm install
$ npm start

## Models
The application uses the following models:

const userSchema = new Schema({
  username: { type: String, required: false, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
});
Top.model.js
rust
Copy code
const topSchema = new Schema({
  title: { type: String, required: true },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});
Comment.model.js
yaml
Copy code
const commentSchema = new Schema({
  text: { type: String, required: true },
  topId: { type: Schema.Types.ObjectId, ref: "Top", required: true },
  topUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
Movie.model.js
javascript
Copy code
const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: String,
  releaseYear: Number,
  rating: Number,
  poster: String,
});

## User Roles
User: Can register, login, and manage their top 5 movie list.
Admin: Can access all features of a regular user and perform additional actions, like managing movies in the database.



## User Routes
POST /signup: Register a new user.
POST /login: Log in an existing user.
Movie Routes
GET /movies: Get a list of all movies.
GET /movies/:movieId: Get detailed information about a specific movie.
POST /movies: Add a new movie to the database (for admin users).
PUT /movies/:movieId: Update the details of a movie (for admin users).
DELETE /movies/:movieId: Remove a movie from the database (for admin users).
User Movie List Routes
GET /users/:userId/movies: Get a user's top 5 movie list.
POST /users/:userId/movies: Add a movie to a user's top 5 list.
DELETE /users/:userId/movies/:movieId: Remove a movie from a user's top 5 list.
External API
The application fetches movie data from the MovieAPI to provide movie details.


