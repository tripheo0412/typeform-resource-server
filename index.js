const app = require('./server');

const { keys } = require('./config');

const PORT = keys.RES_PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Resources server is running at localhost:${PORT}`);
});
