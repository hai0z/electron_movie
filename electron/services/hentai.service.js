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
}

module.exports = HentaiService;
