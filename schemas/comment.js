const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: String
  },
  day: {
    type: Date
  }
});

module.exports = mongoose.model("Comment", commentSchema);