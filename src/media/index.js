import express from 'express';
import { fetchFromOMDB, getMovies, writeMovies } from '../lib/helpers.js';
import uniqid from 'uniqid';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const mediaRouter = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Strive/Netflix-Posters',
  },
});

mediaRouter.get('/', async (req, res, next) => {
  try {
    const movies = await getMovies();
    res.send(movies);
  } catch (error) {
    next(error);
  }
});
mediaRouter.get('/id/:id', async (req, res, next) => {
  try {
    const movies = await getMovies();
    const movie = movies.find((movie) => movie.id === req.params.id);
    res.send(movie);
  } catch (error) {
    next(error);
  }
});
mediaRouter.get('/:query', async (req, res, next) => {
  try {
    const movies = await getMovies();
    const movieFromQuery = movies.find((movie) =>
      movie.Title.toLowerCase().includes(req.params.query)
    );
    if (movieFromQuery) {
      res.send(movieFromQuery);
    } else {
      const movieOMDB = await fetchFromOMDB(req.params.query);
      res.send(movieOMDB);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

mediaRouter.post('/', async (req, res, next) => {
  try {
    const newMovie = {
      id: uniqid(),
      ...req.body,
      createdAt: new Date(),
    };
    const movies = await getMovies();
    movies.push(newMovie);
    await writeMovies(movies);
    res.status(201).send(newMovie);
  } catch (error) {
    next(error);
  }
});
mediaRouter.post(
  '/:id/uploadPoster',
  multer({ storage: cloudinaryStorage }).single('poster'),
  async (req, res, next) => {
    try {
      const movies = await getMovies();
      const movie = movies.find((movie) => movie.id === req.params.id);
      movie.Poster = `${req.file.path}`;
      const remainingMovies = movies.filter(
        (movie) => movie.id !== req.params.id
      );
      remainingMovies.push(movie);
      await writeMovies(remainingMovies);
      res.send(movie);
    } catch (error) {
      next(error);
    }
  }
);
mediaRouter.put('/id/:id', async (req, res, next) => {
  try {
    const movies = await getMovies();
    const newMovieArray = movies.filter((movie) => movie.id !== req.params.id);
    const modifiedMovie = {
      id: req.params.id,
      ...req.body,
      modifiedAt: new Date(),
    };
    newMovieArray.push(modifiedMovie);
    await writeMovies(newMovieArray);
    res.send(modifiedMovie);
  } catch (error) {
    next(error);
  }
});
mediaRouter.delete('/id/:id', async (req, res, next) => {
  try {
    const movies = await getMovies();
    const remainingMovies = movies.filter(
      (movie) => movie.id !== req.params.id
    );
    await writeMovies(remainingMovies);
    res.status(204).send({ message: 'Deleted!' });
  } catch (error) {
    next(error);
  }
});
export default mediaRouter;
