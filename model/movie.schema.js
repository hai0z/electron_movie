const mongoose = require("mongoose");

const ServerDataSchema = new mongoose.Schema({
  name: String,
  slug: String,
  link: String,
});

const EpisodeSchema = new mongoose.Schema({
  server_name: String,
  server_data: [ServerDataSchema],
});

const CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  slug: String,
});

const CountrySchema = new mongoose.Schema({
  id: String,
  name: String,
  slug: String,
});

const MovieSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // tránh trùng
  name: String,
  slug: String,
  content: String,
  type: String,
  status: String,
  thumb_url: String,
  time: String,
  quality: String,
  lang: String,
  actors: [String],
  categories: [CategorySchema],
  country: CountrySchema,
  episodes: [EpisodeSchema],
});
MovieSchema.index({ name: "text", actors: "text" });

module.exports = mongoose.model("Movie", MovieSchema);
