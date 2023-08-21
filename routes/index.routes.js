const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");

const Top = require("../models/Top.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get("/", (req, res, next) => {
  res.render("index", {
    user: req.session.currentUser,
  });
});

router.get("/perfil", isLoggedIn, (req, res, next) => {
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

      const moviePromises = user.top.moviesId.map((movieId) =>
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            api_key: process.env.API_KEY,
          },
        })
      );

      Promise.all(moviePromises)
        .then((responses) => {
          const dataMovies = responses.map((response) => response.data);
          user.top.moviesData = dataMovies; 

          res.render("perfil", { user: user });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.post("/remove-from-top", (req, res, next) => {
  const movieIdToRemove = req.body.movieId;
  const userId = req.session.currentUser._id;

  Top.findOneAndUpdate(
    { owner: userId },
    { $pull: { moviesId: movieIdToRemove } },
    { new: true }
  )
    .then((updatedTop) => {
      if (!updatedTop) {
        return res.status(404).send("Top no encontrado");
      }
      res.redirect("/perfil"); 
    })
    .catch((err) => next(err));
});

router.get("/search", isLoggedIn, (req, res, next) => {
  const movieName = req.query.movie;

  router.get("/search", isLoggedIn, (req, res, next) => {
    const movieName = req.query.movie; 
  
    
    let errorMessage = null;
    if (!movieName) {
      errorMessage = "Por favor, ingresa el nombre de una película.";
    }
  
    return res.render("index", { user: req.user, movies: null, movie: null, errorMessage: errorMessage });
  });

  
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
            errorMessage: "You cannot add more than 5 movies! Please remove one to continue.",
            perfilLink: "/perfil", 
          });
        }
      });
    })
    .catch((err) => next(err));
});

router.post("/remove-from-top", isLoggedIn, (req, res, next) => {
  const movieIdToRemove = req.body.movieId; 

  Top.findOne({ owner: req.session.currentUser._id })
    .then((top) => {
      if (!top) {
        return res.status(404).send("El top no fue encontrado");
      }

      const indexToRemove = top.moviesId.indexOf(movieIdToRemove);
      if (indexToRemove === -1) {
        return res.status(404).send("La película no está en el top");
      }

      top.moviesId.splice(indexToRemove, 1);

      top
        .save()
        .then(() => {
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

        return Promise.all(moviePromises).then((movieResponses) => {
          const moviesData = movieResponses.map((response) => response.data);

         

          return {
            ...top.toObject(),
            moviesData,
          };
        });
      });

      Promise.all(topPromises)
        .then((topsWithMoviesData) => {
          res.render("alltops", { tops: topsWithMoviesData,  user: req.session.currentUser});
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
    .populate("owner comments")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .then((top) => {
      if (!top) {
        return res.status(404).send("Top no encontrado");
      }

      const currentUser = req.session.currentUser;

      top.comments.forEach((comment) => {
        comment.isCurrentUserComment = (
          currentUser &&
          comment.author &&
          (comment.author._id.toString() === currentUser._id.toString())
        );
      });

      const isAdmin = currentUser && currentUser.role === "admin";


      const moviePromises = top.moviesId.map((movieId) =>
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: {
            api_key: process.env.API_KEY,
          },
        })
      );

      Promise.all(moviePromises)
        .then((responses) => {
          const moviesData = responses.map((response) => response.data);
          
          res.render("topdetails", {
            top: top,
            moviesData: moviesData,
            user: currentUser,
            isAdmin: isAdmin,
          });
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});


router.post("/alltops/:id/add-comment", (req, res, next) => {
  const userId = req.session.currentUser._id; 
  const topId = req.params.id;

  Top.findById(topId)
    .then((top) => {
      if (!top) {
        return res.status(404).send("Top no encontrado");
      }

      const newComment = new Comment({
        content: req.body.content,
        author: userId, 
        top: top._id,
      });

      newComment
        .save()
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


router.get("/alltops/:topId/delete/:commentId", (req, res, next) => {
  const topId = req.params.topId;
  const commentId = req.params.commentId;

  
  Top.findById(topId)
    .then((top) => {
      if (!top) {
        return res.status(404).send("Top no encontrado");
      }

       if (!top.comments.includes(commentId)) {
        return res.status(404).send("Comentario no encontrado en este top");
      }

      Comment.findByIdAndRemove(commentId)
        .then(() => {
          top.comments.pull(commentId);
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
