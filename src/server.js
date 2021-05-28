import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  catchAllErrorHandler,
} from './errorHandler.js';

import mediaRouter from './media/index.js';
const server = express();

const { PORT = 3001 } = process.env;
const whitelist = [process.env.FRONTEND_DEV_URL];
const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // origin allowed
      next(null, true);
    } else {
      // origin not allowed
      next(new Error('CORS TROUBLES!!!!!'));
    }
  },
};

server.use(cors(corsOptions));
server.use(express.json());

server.use('/media', mediaRouter);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

console.table(listEndpoints(server));
server.listen(PORT, () => {
  console.log('Server listening on port ', PORT);
});
server.on('error', (error) => console.log(`Server is not running: ${error} `));
