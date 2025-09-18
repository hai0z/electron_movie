const Hentai = require("../../model/hentai.schema.js");

class HentaiService {
  async getHentais(page = 1, limit = 48) {
    const skip = (page - 1) * limit;
    const hentais = await Hentai.find().skip(skip).limit(limit).exec();
    const total = await Hentai.countDocuments().exec();
    return {
      data: hentais,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }
  async searchHentais(query) {
    const { page = 1, limit = 48, title, genres, studios } = query;
    const skip = (page - 1) * limit;

    const filter = {};

    if (title && title.trim() !== "") {
      filter.$text = { $search: title };
    }

    if (genres && genres.length > 0) {
      filter["genres.id"] = { $in: Array.isArray(genres) ? genres : [genres] };
    }

    if (studios && studios.length > 0) {
      filter["studios.id"] = {
        $in: Array.isArray(studios) ? studios : [studios],
      };
    }

    const hentais = await Hentai.find(filter).skip(skip).limit(limit);

    const total = await Hentai.countDocuments(filter);

    return {
      data: hentais,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  async getGenres() {
    const uniqueGenres = await Hentai.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres.id",
          doc: { $first: "$genres" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
    ]);
    return uniqueGenres;
  }
  async getStudios() {
    const uniqueStudios = await Hentai.aggregate([
      { $unwind: "$studios" },
      {
        $group: {
          _id: "$studios.id",
          doc: { $first: "$studios" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
    ]);
    return uniqueStudios;
  }
}

module.exports = HentaiService;
