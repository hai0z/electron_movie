var axios = require("axios");

var api = axios.create({
  baseURL: " https://avdbapi.com/api.php/",
});

var api2 = axios.create({
  baseURL: "https://api.crawl.team",
});

var api3 = axios.create({
  baseURL: "https://www.avrebo.com",
});
var api4 = axios.create({
  baseURL: "https://xvidapi.com/api.php/",
});

var api5 = axios.create({
  baseURL: "https://www.eporner.com/api/v2/video/",
});

var Category = {
  censored: 0,
  uncensored: 1,
  Uncensored_Leaked: 2,
  Chinese: 3,
  new: 4,
  other: 5,
  random: 6,
  amateur: 7,
  western: 8,
};

function MovieService() {
  this.getRandomParam = function () {
    return "&_=" + new Date().getTime();
  };

  this.getOtherCate = function (data) {
    return api2
      .get(
        `/xxx/api-posts?cate_ids=${data.cate_ids}&source=${data.source}&limit=99999`
      )
      .then((res) => res.data);
  };

  this.getTikTok = function () {
    return api3
      .get(`/avrebo-api/v1/video/listRandom?limit=50`)
      .then((res) => res.data);
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

  this.getAllOld = function (page) {
    if (page === undefined) {
      page = 1;
    }
    return api4
      .get("provide/vod?ac=detail&pg=" + page + this.getRandomParam())
      .then(function (response) {
        return response.data;
      });
  };

  this.getEporn = function (params) {
    if (params.page === undefined) {
      params.page = 1;
    }
    return api5
      .get(
        `search/?query=${params.query}&per_page=1000&page=${params.page}&thumbsize=big&order=top-weekly&gay=0&lq=0&format=json`
      )
      .then(function (response) {
        return response.data;
      })
      .catch((err) => console.log(err));
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
  this.getOldMovieDetail = function (id) {
    return api4
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
          .get("provide/vod?ac=detail&t=3&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );

      case Category.Chinese:
        return api
          .get("provide/vod?ac=detail&t=5&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );
      case Category.amateur:
        return api
          .get("provide/vod?ac=detail&t=4&pg=" + page + this.getRandomParam())
          .then(
            function (response) {
              return response.data;
            }.bind(this)
          );
      case Category.western:
        return api
          .get("provide/vod?ac=detail&t=6&pg=" + page + this.getRandomParam())
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
    var page = Math.floor(Math.random() * 400) + 1;
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
    related: related.list.slice(0, 8),
  };
};
const getMovieDetailOld = async (id) => {
  const [details] = await Promise.all([m.getOldMovieDetail(id)]);

  return {
    details,
    related: [],
  };
};

var m = new MovieService();

module.exports = {
  getHomeData,
  movieService: m,
  getMovieDetail,
  getMovieDetailOld,
};
