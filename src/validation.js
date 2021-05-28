import { body } from 'express-validator';
export const movieValidator = [
  body('Title').exists().withMessage('You have to provide title'),
  body('Year').exists().withMessage('You have to add a year'),
];
