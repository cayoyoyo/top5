Project Image
![Project Image](./public/images/top53.jpeg)

# About
Welcome to top5, a web application that allows users to register, create their top 5 favorite movies list, and explore or comment on other users' top lists.

# Deployment
You can play the game [here]

# Installation Guide
Fork this repo
Clone this repo
```shell
$ cd portfolio-back
$ npm install
$ npm start
```
# Models

## User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: false, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: Boolean,
});
```

## Top.model.js
```js
const topSchema = new mongoose.Schema({
  title: { type: String, required: true },
  moviesId: {
    type: [String],
    validate: {
        validator: function (moviesId) {
          return moviesId.length === 5;
        },
        message: "A top must have exactly 5 movies.",
      }, 
      required: true,
  },
});


```
## Comment.model.js
```js
const commentSchema = new Schema({
    content: {type: String, required: true,},
    topId: { type: Schema.Types.ObjectId, ref: "Top", required: true,},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true,
});
```


# User Roles
| Role    | Description                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User    | Can register, login, and manage their top 5 movie list, explore other users' top lists, and leave comments on them.                                                         |
| Admin   | Can access all features of a regular user and perform additional actions, like managing movies in the database.                                                             |


# User Routes
# API Endpoints
| Method | Endpoint                       | Request Body                        | Response (200)                    | Action                                             |
| ------ | ------------------------------ | ----------------------------------- | -------------------------------- | -------------------------------------------------- |
| POST   | /signup                        | { username, email, password }       | -                                | Registers the user in the database.                |
| POST   | /login                         | { email, password }                 | { authToken: authToken }         | Logs in a user already registered.                 |
| GET    | /movies                        | -                                   | { movies: [movie] }              | Retrieves a list of movies from the TMDb API.      |
| GET    | /movies/:movieId               | -                                   | { movie: movie }                 | Retrieves detailed information about a specific movie from the TMDb API. |
| GET    | /users/:userId/movies          | -                                   | { topList: [movie] }             | Get a user's top 5 movie list from the database.   |
| POST   | /users/:userId/movies          | { movieId }                         | -                                | Add a movie to the user's top 5 list in the database. |
| GET    | /tops                          | -                                   | { tops: [top] }                  | Retrieves a list of top lists from the database.   |
| GET    | /tops/:topId                   | -                                   | { top: top }                     | Retrieves detailed information about a specific top list from the database. |
| GET    | /tops/:topId/comments          | -                                   | { comments: [comment] }          | Get comments for a specific top list from the database. |
| POST   | /tops/:topId/comments          | { text }    






