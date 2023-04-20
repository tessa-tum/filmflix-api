const express = require('express');
  morgan = require('morgan'),
  fs = require('fs'), 
  path = require('path');

const app = express();

// GET requests
app.get('/movies', (req, res) => {
  let topMovies = [
    { title: 'Everything Everywhere All At Once', director: 'Daniel Kwan', year: 2022 },
    { title: 'Mononoke-hime', director: 'Hayao Miyazaki',  year: 1997 },
    { title: 'The Woman King', director: 'Gina Prince-Bythewood', year: 2022 },
    { title: 'Snowpiercer', director: 'Bong Joon Ho',  year: 2013 },
    { title: 'Parasite', director: 'Bong Joon Ho',  year: 2019 },
    { title: 'The Old Guard', director: 'Gina Prince-Bythewood',  year: 2020 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', director: 'Peter Jackson', year: 2001 },
    { title: 'Annihilation', director: 'Alex Garland', year: 2018 },
    { title: 'Moonlight', director: 'Barry Jenkins', year: 2016 },
    { title: 'Thelma & Louise', director: 'Ridley Scott', year: 1991 }
  ];
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

// log requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

app.use(morgan('common'));

// error-handler to log application-level errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// serve documentation file from public folder
app.use(express.static('public'));

// listen for requests
app.listen(8080, () => {
  console.log('Server listening on port 8080');
});