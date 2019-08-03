/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { keys, mongooseOptions } = require('./config');

require('./middlewares/passport');

if (process.env.NODE_ENV !== 'TEST') {
  mongoose
    .connect(keys.mongoURI, mongooseOptions)
    .then(() => console.log(`MongoDB ${keys.type} connected`))
    .catch(err => console.log(err));
}
const app = express();
app.use(helmet({ ieNoOpen: false }));
app.enable('trust proxy');
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public/apidoc'));
app.get('/', (req, res) => {
  res.json({ message: 'Resources Server' });
});

app.get('/apidoc', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/apidoc/index.html`));
});

app.use('/users', require('./routers/users'));
app.use(
  '/templates',
  passport.authenticate('jwt', { session: false }),
  require('./routers/templates')
);
app.use(
  '/themes',
  passport.authenticate('jwt', { session: false }),
  require('./routers/themes')
);
app.use(
  '/workspaces',
  passport.authenticate('jwt', { session: false }),
  require('./routers/workspaces')
);
app.use(
  '/forms',
  passport.authenticate('jwt', { session: false }),
  require('./routers/forms')
);

app.get(
  '/secret',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send('ok');
  }
);

module.exports = app;
