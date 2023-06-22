const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  nickname: {
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
  },
  postId: {
    type: String,
  }
});

module.exports = mongoose.model("Comment", commentSchema);