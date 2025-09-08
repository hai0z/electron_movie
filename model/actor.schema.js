var mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  type: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  shape: { type: String },
  url: { type: String, required: true },
});

const ActorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: ImageSchema, required: true },
});

module.exports = mongoose.model("actor", ActorSchema);
