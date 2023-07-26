const mongoose = require("mongoose");

const topSchema = new mongoose.Schema({
  title: { type: String, required: true },
  moviesId: {
    type: [String],
    validate: {
        validator: function (moviesId) {
          return moviesId.length <= 4;
        },
        message: "A top must have exactly 5 movies.",
      }, 
      required: true,
  },
});

const Top = mongoose.model("Top", topSchema);

module.exports = Top;
