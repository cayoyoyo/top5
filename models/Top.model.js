const { Schema, model } = require("mongoose");

const topSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moviesId: {
    type: [String],
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Top = model("Top", topSchema);

module.exports = Top;
