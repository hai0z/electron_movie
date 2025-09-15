const Movie = require("../../model/movie.schema.js");
const Actor = require("../../model/actor.schema.js");

const {
  getHomeData,
  movieService,
  getMovieDetail,
  getMovieDetailOld,
} = require("./main.service.js");
const { recommendFromDB } = require("./recommend.service.js");

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

  static async getRandom() {
    const movie = await Movie.aggregate([
      { $match: { actors: { $exists: true, $ne: [] } } }, // actor tồn tại và không rỗng
      { $sample: { size: 1 } }, // lấy ngẫu nhiên 1
    ]);
    return movie[0];
  }
  static async getActor(query) {
    const { page = 1, limit = 30 } = query;
    const skip = (page - 1) * limit;

    const actors = await Actor.find().skip(skip).limit(limit);

    const total = await Actor.countDocuments();

    return {
      status: true,
      page: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
      actors,
    };
  }
  static async getActorMovie(query) {
    const { page = 1, limit = 30, name } = query;
    const skip = (page - 1) * limit;

    // Tách từ khóa người dùng nhập ra thành mảng
    const keywords = name.split(" ").filter(Boolean);

    // Tạo mảng regex (không phân biệt hoa thường)
    const regexConditions = keywords.map((k) => new RegExp(k, "i"));

    const movies = await Movie.find({
      actors: { $all: regexConditions }, // chứa hết các từ, không cần đúng thứ tự
    })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({
      actors: { $all: regexConditions },
    });

    return {
      status: true,
      page: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
      movies,
    };
  }

  static async searchActors(query) {
    const { page = 1, limit = 30, name } = query;
    const skip = (page - 1) * limit;

    const actors = await Actor.find({
      $text: { $search: name },
    })
      .skip(skip)
      .limit(limit);

    const total = await Actor.countDocuments({
      $text: { $search: name },
    });

    return {
      status: true,
      page: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
      actors,
    };
  }

  static async getMaybeLike(watchHistory) {
    const data = await recommendFromDB(watchHistory);

    const actors = data.map((actor) => actor.actors.join());

    const movies = data.slice(0, 4);

    const actorResult = await Actor.find({
      name: { $in: actors },
    });
    return {
      actors: actorResult.slice(0, 4),
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
