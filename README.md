
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


## Rutas de Autenticación (auth)

- **GET /auth/signup**
  - Middleware: isLoggedOut
  - Acción: Renderiza la página de registro.

- **POST /auth/signup**
  - Middleware: isLoggedOut
  - Acción: Registra al usuario en la base de datos y redirecciona a la página de inicio de sesión.

- **GET /auth/login**
  - Middleware: isLoggedOut
  - Acción: Renderiza la página de inicio de sesión.

- **POST /auth/login**
  - Middleware: isLoggedOut
  - Acción: Inicia sesión con un usuario registrado y redirecciona a la página de inicio.

- **GET /auth/logout**
  - Middleware: isLoggedIn
  - Acción: Cierra la sesión del usuario y redirecciona a la página de inicio.

## Rutas de la Página de Inicio (index)

- **GET /**
  - Acción: Renderiza la página de inicio.

- **GET /perfil**
  - Middleware: isLoggedIn
  - Acción: Muestra el perfil del usuario con información de las películas en su top.

- **POST /remove-from-top**
  - Acción: Elimina una película del top del usuario.

- **GET /search**
  - Middleware: isLoggedIn
  - Acción: Realiza una búsqueda de películas por nombre.

- **GET /movies/:id**
  - Middleware: isLoggedIn
  - Acción: Muestra detalles de una película específica.

- **POST /add-to-top5**
  - Middleware: isLoggedIn
  - Acción: Agrega una película al top del usuario.

- **GET /alltops**
  - Middleware: isLoggedIn
  - Acción: Muestra una lista de todos los tops.

- **GET /alltops/:id**
  - Acción: Muestra detalles de un top específico.

- **POST /alltops/:id/add-comment**
  - Middleware: isLoggedIn
  - Acción: Agrega un comentario a un top específico.

- **GET /alltops/:topId/delete/:commentId**
  - Acción: Elimina un comentario de un top específico.
               



