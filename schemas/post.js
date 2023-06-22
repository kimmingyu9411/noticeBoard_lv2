const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  day: {
    type: Date
  },
  update: {
    type: Date
  },
  userId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Post", postSchema);