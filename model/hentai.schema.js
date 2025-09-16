var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GenreSchema = new Schema(
  {
    id: Number,
    name: String,
    slug: String,
    thumbnail: String,
    taxonomy: String,
    description: String,
    count: Number,
  },
  { _id: false }
);

var TagSchema = new Schema(
  {
    id: Number,
    name: String,
    slug: String,
    thumbnail: String,
    taxonomy: String,
    description: String,
    count: Number,
  },
  { _id: false }
);

var StudioSchema = new Schema(
  {
    id: Number,
    name: String,
    slug: String,
    thumbnail: String,
    taxonomy: String,
    description: String,
    count: Number,
  },
  { _id: false }
);

var ReleaseYearSchema = new Schema(
  {
    id: Number,
    name: String,
    slug: String,
    thumbnail: String,
    taxonomy: String,
    description: String,
    count: Number,
  },
  { _id: false }
);

var HentaiSchema = new Schema({
  id: Number,
  title: String,
  slug: String,
  synopsis: String,
  createdAt: String,
  updatedAt: String,
  url: String,
  commentUrl: String,
  genres: [GenreSchema],
  tags: [TagSchema],
  studios: [StudioSchema],
  releaseYear: ReleaseYearSchema,
  views: Number,
  likes: Number,
  dislikes: Number,
  alternativeTitles: [String],
  thumbnail: String,
  poster: String,
  notes: String,
  censorship: String,
  category: String,
  languages: [String],
  isTrailer: Boolean,
  links: [String],
});

HentaiSchema.index({ title: "text" });

module.exports = mongoose.model("Hentai", HentaiSchema);
