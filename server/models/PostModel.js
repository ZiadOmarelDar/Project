const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
{
   title: { type: String},
   content: { type: String, required: true },
   image: { type: String },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
   },
},
{ timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
