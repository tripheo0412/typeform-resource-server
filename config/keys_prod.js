const keysProd = {
  mongoURI: `mongodb://${process.env.db_user}:${process.env.db_pass}@${process.env.db_host}:${process.env.db_post}/${process.env.db_collection}`,
  type: 'PROD',
};

module.exports = keysProd;
