const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    topId: {
      type: Schema.Types.ObjectId,
      ref: "Top",
      required: true,
    },
    topUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;