const Movie = require("../../model/movie.schema.js");
const {
  getHomeData,
  movieService,
  getMovieDetail,
  getMovieDetailOld,
} = require("./main.service.js");

class MovieService {
  static async searchOffline(query) {
    const { q, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find({ $text: { $search: q } })
        .skip(skip)
        .limit(limit)
        .sort({ score: { $meta: "textScore" } })
        .select({ score: { $meta: "textScore" } }),
      Movie.countDocuments({ $text: { $search: q } }),
    ]);

    return {
      status: true,
      msg: "Tìm kiếm thành công",
      page: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
      movies,
    };
  }

  static async getHomeData() {
    return await getHomeData();
  }

  static async getMovieDetail(id) {
    return await getMovieDetail(id);
  }

  static async getMovieDetailOld(id) {
    return await getMovieDetailOld(id);
  }

  static async getByCategory(category, page, keyword) {
    return await movieService.getByCategory(category, page, keyword);
  }

  static async search(keyword, page) {
    return await movieService.search(keyword, page);
  }

  static async getOtherCate(inputData) {
    return await movieService.getOtherCate(inputData);
  }

  static async getLive() {
    return await movieService.getLive();
  }

  static async getTikTok() {
    return await movieService.getTikTok();
  }

  static async getAllOld(page) {
    return await movieService.getAllOld(page);
  }
}

module.exports = MovieService;
