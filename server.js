/* eslint-disable no-console */
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { keys, mongooseOptions } = require('./src/config');

require('./src/middlewares/passport');

if (process.env.NODE_ENV !== 'TEST') {
  console.log(keys.mongoURI);
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
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public/apidoc'));
app.get('/', (req, res) => {
  res.json({ message: 'Resources Server' });
});
app.get('/apidoc', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/apidoc/index.html`));
});

app.use('/users', require('./src/routers/usersRouter'));
app.use('/templates', require('./src/routers/templatesRouter'));
app.use('/themes', require('./src/routers/themesRouter'));
app.use('/workspaces', require('./src/routers/workspacesRouter'));
app.use('/forms', require('./src/routers/formsRouter'));

const PORT = keys.RES_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Resources server is running at localhost:${PORT}`);
});
