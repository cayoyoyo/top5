const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");

const Top = require("../models/Top.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    user: req.session.currentUser,
  });
});

router.get("/perfil", (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate({
      path: "top",
      populate: {
        path: "moviesId",
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Obtener la información completa de las películas del top
      const moviePromises = user.top.moviesId.map((movieId) =>
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            api_key: process.env.API_KEY,
          },
        })
      );

      // Ejecutar las solicitudes en paralelo
      Promise.all(moviePromises)
        .then((responses) => {
          const dataMovies = responses.map((response) => response.data);
          user.top.moviesData = dataMovies; // Almacenar los detalles de las películas en 'moviesData'

          res.render("perfil", { user: user });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.post("/remove-from-top", (req, res, next) => {
  const movieIdToRemove = req.body.movieId;
  const userId = req.session.currentUser._id;

  // Buscar el top del usuario actual y eliminar la película del arreglo 'moviesId'
  Top.findOneAndUpdate(
    { owner: userId },
    { $pull: { moviesId: movieIdToRemove } },
    { new: true }
  )
    .then((updatedTop) => {
      if (!updatedTop) {
        return res.status(404).send("Top no encontrado");
      }
      res.redirect("/perfil"); // Redireccionar a la página del perfil después de eliminar
    })
    .catch((err) => next(err));
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
          const imageUrl =
            images.length > 0
              ? `https://image.tmdb.org/t/p/w500${images[0].file_path}`
              : null;

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
  console.log(req.session.currentUser);
  const movieId = req.body.movieId;
  let imageUrl;
  // Obtener la película a partir del movieId utilizando la API de TMDB
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
          imageUrl =
            images.length > 0
              ? `https://image.tmdb.org/t/p/w500${images[0].file_path}`
              : null;
        })
        .catch((err) => next(err));

      Top.findById(req.session.currentUser.top).then((top) => {
        if (top.moviesId.length <= 4) {
          return Top.findByIdAndUpdate(
            req.session.currentUser.top,
            {
              $push: { moviesId: response.data.id },
            },
            { new: true }
          )

            .then((response) => {
              console.log(response);
              res.redirect("/perfil");
            })

            .catch((err) => next(err));
        } else {
          res.render("movieinfo", {
            user: req.session.currentUser,
            movie: movieData,
            imageUrl: imageUrl,
            errorMessage: "No puedes añadir más de 5 películas, greedy!",
          });
        }
      });
    })
    .catch((err) => next(err));
});

router.post("/remove-from-top", isLoggedIn, (req, res, next) => {
  const movieIdToRemove = req.body.movieId; // Asegúrate de que movieIdToRemove tenga un valor válido

  // Buscar el top del usuario actual en la base de datos
  Top.findOne({ owner: req.session.currentUser._id })
    .then((top) => {
      if (!top) {
        return res.status(404).send("El top no fue encontrado");
      }

      // Encontrar el índice de la película a eliminar en el array moviesId
      const indexToRemove = top.moviesId.indexOf(movieIdToRemove);
      if (indexToRemove === -1) {
        return res.status(404).send("La película no está en el top");
      }

      // Eliminar la película del array moviesId
      top.moviesId.splice(indexToRemove, 1);

      // Guardar el top actualizado en la base de datos
      top
        .save()
        .then(() => {
          // Redireccionar a la página de perfil después de eliminar la película
          res.redirect("/perfil");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});



router.get("/alltops", isLoggedIn, (req, res, next) => {
  Top.find()
    .populate("owner", "username")
    .then((tops) => {
      const topPromises = tops.map((top) => {
        const moviePromises = top.moviesId.map((movieId) =>
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              api_key: process.env.API_KEY,
            },
          })
        );

        return Promise.all(moviePromises)
          .then((movieResponses) => {
            const moviesData = movieResponses.map((response) => response.data);

            return {
              ...top.toObject(),
              moviesData,
            };
          });
      });

      Promise.all(topPromises)
        .then((topsWithMoviesData) => {
          res.render("alltops", { tops: topsWithMoviesData });
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/alltops/:id", (req, res, next) => {
  const topId = req.params.id;

  Top.findById(topId)
    .populate({
      path: "moviesId",
    })
    .populate({
      path: "comments",
    })
    .then((top) => {
      if (!top) {
        return res.status(404).send("Top no encontrado");
      }

      res.render("topdetails", { top });
    })
    .catch((error) => {
      next(error);
    });
});



router.post("/alltops/:id/add-comment", (req, res, next) => {
  Top.findById(req.params.id)
    .then((top) => {
      if (!top) {
        return res.status(404).send("Top no encontrado");
      }
      
      const newComment = new Comment({
        content: req.body.content,
        top: top._id,
      });

      newComment.save()
        .then(() => {
          top.comments.push(newComment._id);
          return top.save();
        })
        .then(() => {
          res.redirect(`/alltops/${top._id}`);
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});



module.exports = router;
