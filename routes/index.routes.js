const express = require("express");
const router = express.Router();

const axios = require("axios");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get("/search", (req, res, next) => {
  const movieName = req.query.movie; // Obtener el nombre de la película del formulario

  // Verificar si el usuario ingresó un nombre de película válido
  if (!movieName) {
    return res.send("Por favor, ingresa el nombre de una película.");
  }

  // Realizar la búsqueda de películas utilizando el nombre proporcionado
  axios
    .get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: process.env.API_KEY,
        query: movieName,
      },
    })
    .then((response) => {
      const movies = response.data.results;
      res.render("index", { movies });
    })
    .catch((err) => next(err));
});

router.get("/movies/:id", (req, res, next) => {
  console.log(req.params.id);
  axios
    .get(`https://api.themoviedb.org/3/movie/${req.params.id}`, {
      params: {
        api_key: process.env.API_KEY,
      }, 
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => next(err));
});

module.exports = router;
