const mongoose = require("mongoose");

let conn;


module.exports = {
  connectToServer: async function (callback) {
        try {
          mongoose.connect(process.env.ATLAS_URI)
        } catch (err) {
          return callback(err)
        }

        conn = mongoose.connection;
        conn.on('error', console.error.bind(console, 'connection error:'));
        conn.once('open', function callback () {
          console.log("Successfully connected to MongoDB");
      });
  },

  getDb: function () {
    return conn;
  },
};