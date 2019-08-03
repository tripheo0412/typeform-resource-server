const keysTest = {
  mongoURI: `mongodb://${process.env.DB_USER_TEST}:${process.env.DB_PASS_TEST}@${process.env.DB_HOST_TEST}:${process.env.DB_PORT_TEST}/${process.env.DB_COLLECTION_TEST}`,
  type: 'TEST',
};

module.exports = keysTest;
