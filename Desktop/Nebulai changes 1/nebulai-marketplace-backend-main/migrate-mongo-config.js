module.exports = {
    mongodb: {
      url: "mongodb://localhost:27017/nebulai-test",
    //   databaseName: "nebulai-test",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    migrationsDir: "migrations",
    changelogCollectionName: "migrations",
  };
  