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
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true, },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,  },
    password: {
      type: String,
      required: true,   },
    top: {
      type: Schema.Types.ObjectId,
      ref: "Top",  },
    isAdmin: Boolean  },
  { timestamps: true, }
);
```

## Top.model.js
```js
const topSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, },
  moviesId: {
    type: [String],
    required: true, },
  comments: [
    { type: Schema.Types.ObjectId,
      ref: "Comment", }, ],
});



```
## Comment.model.js
```js
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true, },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, }, },
  { timestamps: true, }
);
```


# User Roles
| Role    | Description                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User    | Can register, login, and manage their top 5 movie list, explore other users' top lists, and leave comments on them.                                                         |
| Admin   | Can access all features of a regular user and perform additional actions, like managing movies in the database.                                                             |


# User Routes
# Auth Routes
## API Endpoints

| Method | Endpoint                  | Request Body                      | Response (200)                  | Action                                              |
| ------ | ------------------------- | --------------------------------- | ------------------------------- | --------------------------------------------------- |
| GET    | /auth/signup              | -                                 | -                               | Renders the signup form.                          |
| POST   | /auth/signup              | { username, email, password }     | -                               | Registers a new user.                             |
| GET    | /auth/login               | -                                 | -                               | Renders the login form.                           |
| POST   | /auth/login               | { email, password }               | -                               | Logs in a user.                                  |
| GET    | /auth/logout              | -                                 | -                               | Logs out the current user.                        |
| GET    | /                                     | -                                 | -                               | Renders the home page.                              |
| GET    | /perfil                               | -                                 | -                               | Renders the user's profile page.                    |
| POST   | /remove-from-top                      | { movieId }                       | -                               | Removes a movie from the user's top list.           |
| GET    | /search                               | -                                 | { movies: [movie] }            | Retrieves a list of movies based on the search.    |
| GET    | /movies/:id                           | -                                 | { movie: movie }               | Retrieves detailed information about a movie.      |
| POST   | /add-to-top5                          | { movieId }                       | -                               | Adds a movie to the user's top list.                |
| GET    | /alltops                              | -                                 | { tops: [top] }                | Retrieves a list of all top lists.                 |
| GET    | /alltops/:id                          | -                                 | { top: top }                   | Retrieves detailed information about a top list.   |
| POST   | /alltops/:id/add-comment              | { content }                       | -                               | Adds a comment to a top list.                      |
| POST   | /alltops/:topId/delete-comment/:commentId | -                             | -                               | Deletes a comment from a top list.                |



