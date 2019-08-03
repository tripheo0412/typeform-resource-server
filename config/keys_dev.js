const keysDev = {
  mongoURI: `mongodb://${process.env.db_user_dev}:${process.env.db_pass_dev}@${process.env.db_host_dev}:${process.env.db_port_dev}/${process.env.db_collection_dev}`,
  type: 'DEV',
};

module.exports = keysDev;
