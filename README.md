Project Image
![Project Image](./public/images/top53.jpeg)

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

Method	Endpoint	Request Body	Response (200)	Action
POST	/signup	{ username, email, password }	-	Registers the user in the database.
POST	/login	{ email, password }	{ authToken: authToken }	Logs in a user already registered.
GET	/movies	-	{ movies: [movie] }	Retrieves a list of movies from the TMDb API.
GET	/movies/:movieId	-	{ movie: movie }	Retrieves detailed information about a specific movie from the TMDb API.
GET	/users/:userId/movies	-	{ topList: [movie] }	Get a user's top 5 movie list from the database.
POST	/users/:userId/movies	{ movieId }	-	Add a movie to the user's top 5 list in the database.
GET	/tops	-	{ tops: [top] }	Retrieves a list of top lists from the database.
GET	/tops/:topId	-	{ top: top }	Retrieves detailed information about a specific top list from the database.
GET	/tops/:topId/comments	-	{ comments: [comment] }	Get comments for a specific top list from the database.
POST	/tops/:topId/comments	{ text }	-	Add a comment to a top list in the database.






DELETE /users/:userId/movies/:movieId: Remove a movie from a user's top 5 list.
External API
The application fetches movie data from the MovieAPI to provide movie details.


