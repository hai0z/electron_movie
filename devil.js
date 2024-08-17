var axios = require("axios");

var api = axios.create({
  baseURL: " https://avdbapi.com/api.php/",
});

var Category = {
  censored: 0,
  uncensored: 1,
  Uncensored_Leaked: 2,
  Chinese: 3,
  new: 4,
  other: 5,
  random: 6,
};

function MovieService() {
  this.getRandomParam = function () {
    return "&_=" + new Date().getTime();
  };

  this.getAll = function (page) {
    if (page === undefined) {
      page = 1;
    }
    return api
      .get("provide/vod?ac=detail&pg=" + page + this.getRandomParam())
      .then(function (response) {
        return response.data;
      });
  };

  this.getMovieDetail = function (id) {
    return api
      .get("provide/vod?ac=detail&ids=" + id + this.getRandomParam())
      .then(
        function (response) {
          return response.data;
        }.bind(this)
      );
  };

  this.search = function (keyword, page) {
    return api.get("provide/vod?ac=detail&wd=" + keyword + "&pg=" + page).then(
      function (response) {
        return response.data;
      }.bind(this)
    );
  };

  this.getByCategory = function (category, page, keyword) {
    if (page === undefined) {
      page = 1;
    }

    switch (category) {
      case Category.censored:
        return api
          .get("provide/vod?ac=detail&t=1&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.uncensored:
        return api
          .get("provide/vod?ac=detail&t=2&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.Uncensored_Leaked:
        return api
          .get("provide/vod?ac=detail&t=9&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.Chinese:
        return api
          .get("provide/vod?ac=detail&t=10&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.new:
        return api
          .get("provide/vod?ac=detail&h=24&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.other:
        return api
          .get("provide/vod?ac=detail&wd=" + keyword + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.random:
        return this.getRandomVideo();

      default:
        return Promise.reject(new Error("Unknown category"));
    }
  };

  this.getRandomVideo = function () {
    var page = Math.floor(Math.random() * 2003) + 1;
    return api
      .get("provide/vod?ac=detail&pg=" + page + this.getRandomParam())
      .then(
        function (response) {
          return response.data;
        }.bind(this)
      );
  };
}

const getHomeData = async () => {
  const [home, censored, uncensored, uncensoredLeaked, chinese] =
    await Promise.all([
      m.getAll(),
      m.getByCategory(Category.censored),
      m.getByCategory(Category.uncensored),
      m.getByCategory(Category.Uncensored_Leaked),
      m.getByCategory(Category.Chinese),
    ]);
  return {
    home,
    censored,
    uncensored,
    uncensoredLeaked,
    chinese,
  };
};

const getMovieDetail = async (id) => {
  const [details, related] = await Promise.all([
    m.getMovieDetail(id),
    m.getRandomVideo(),
  ]);

  return {
    details,
    related: related.list.slice(0, 10),
  };
};

var m = new MovieService();

module.exports = {
  getHomeData,
  movieService: m,
  getMovieDetail,
};
