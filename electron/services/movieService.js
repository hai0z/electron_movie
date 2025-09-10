const Movie = require("../../model/movie.schema.js");
const Actor = require("../../model/actor.schema.js");
const HistoryItem = require("../../model/userData.schema");

const {
  getHomeData,
  movieService,
  getMovieDetail,
  getMovieDetailOld,
} = require("./main.service.js");
const DeviceIdManager = require("../utils/deviceId.js");
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

    // Tìm các movie mà mảng actors chứa tên này
    const movies = await Movie.find({
      actors: name, // <-- đây là key
    })
      .skip(skip)
      .limit(limit);

    // Tính tổng số actor (hoặc có thể tính tổng movie nếu muốn)
    const total = await Movie.countDocuments({
      actors: name,
    });

    return {
      status: true,
      page: {
        current_page: page,
        per_page: limit,
        total,
        last_page: Math.ceil(total / limit),
      },
      movies, // trả về movies thay vì actors
    };
  }

  static async searchActors(query) {
    const { page = 1, limit = 30, name } = query;
    const skip = (page - 1) * limit;

    // Tìm actor theo tên gần đúng (case-insensitive)
    const filter = name ? { name: { $regex: name, $options: "i" } } : {};

    const actors = await Actor.find(filter).skip(skip).limit(limit);

    const total = await Actor.countDocuments(filter);

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
