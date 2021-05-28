import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data');

const { readJSON, writeJSON } = fs;

export const getMovies = async () =>
  await readJSON(join(dataFolderPath, 'movies.json'));
export const writeMovies = async (content) =>
  await writeJSON(join(dataFolderPath, 'movies.json'), content);
export const fetchFromOMDB = async (query) => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=e741ac6e&s=${query}`
    );
    if (response.ok) {
      const movieOMDB = await response.json();
      return movieOMDB;
    }
  } catch (error) {
    console.log(error);
  }
};
