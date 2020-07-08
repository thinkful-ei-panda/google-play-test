const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

const data = require('./data');

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello Express!');
});

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let dataClone = [...data];

  if (sort && sort !== 'Rating' && sort !== 'App') {
    return res
      .status(400)
      .send('Sort must include Rating or App');
  }

  if (sort) {
    dataClone.sort((a, b) => {
      //1, 0, -1

      const newA = a[sort];
      const newB = b[sort];

      if (newA > newB) {
        return 1;
      } else if (newA < newB) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  const allGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

  if (genres && !allGenres.includes(genres)) {
    return res
      .status(400)
      .send('Genre must include Action, Puzzle, Strategy, Casual, Arcade, Card');
  }

  if (genres) {
    dataClone = dataClone.filter(item => item.Genres === genres);
  }

  res.send(dataClone);
});

module.exports = app;