const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");


const Top = require('../models/Top.model');

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    user: req.session.currentUser
  });
});



router.get("/search", isLoggedIn, (req, res, next) => {
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
      let dataMovies = [];
      movies.forEach((movie) => {
        console.log(movie);
        movie.release_date = movie.release_date.slice(0, 4);
        dataMovies.push(movie);
      });
      console.log("dataMovies:", dataMovies);
      res.render("index", {
        user: req.session.currentUser,
        movies: dataMovies,
      });
    })
    .catch((err) => next(err));
});


router.get("/movies/:id", isLoggedIn, (req, res, next) => {
  const movieId = req.params.id;

  axios
    .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: process.env.API_KEY,
      },
    })
    .then((response) => {
      const movieData = response.data;

      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
          params: {
            api_key: process.env.API_KEY,
          },
        })
        .then((imageResponse) => {
          const images = imageResponse.data.backdrops;
          const imageUrl = images.length > 0 ? `https://image.tmdb.org/t/p/w500${images[0].file_path}` : null;


      res.render("movieinfo", {
        user: req.session.currentUser,
        movie: movieData,
        imageUrl: imageUrl,
      });
    });
    })
    .catch((err) => next(err));
});






router.post("/add-to-top5", isLoggedIn, (req, res, next) => {
  const movieId = req.body.movieId;
  // Obtener la película a partir del movieId utilizando la API de TMDB
  axios
    .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: process.env.API_KEY,
      },
    })
    .then((response) => {
      const movieData = response.data;
      // Obtener el top 5 actual del usuario desde la sesión (si existe)
      const userTop5 = req.session.currentUser.top5 || [];
      // Verificar si la película ya está en el top 5 del usuario
      if (!userTop5.find((movie) => movie.id === movieData.id)) {
        // Agregar la película al top 5 del usuario (solo si no está ya presente)
        userTop5.push(movieData);
        // Actualizar el top 5 en la sesión del usuario
        req.session.currentUser.top5 = userTop5;
      
        const newTop = new Top({
          title: 'top',
          movies: userTop5.map((movie) => movie.id), // Solo almacenar los IDs de las películas en el top
        });

        // Guardar el documento Top en la base de datos
        newTop.save()
          .then((savedTop) => {
            console.log('Top guardado en la base de datos:', savedTop);
            // Redirigir al usuario de regreso a la página de información de la película
            res.redirect('/');
          })
          .catch((err) => next(err));
      } else {
        // Si la película ya está en el top, redirigir al usuario de regreso a la página de información de la película
        res.redirect('/');
      }
    })
    .catch((err) => next(err));
});


module.exports = router;
