const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../model/movie.schema.js");
const Noti = require("../model/noti.schema.js");
const User = require("../model/userData.schema.js");
const { connectDB } = require("../config/db.js");
const { Notification } = require("electron");

const API_URL = "https://xxvnapi.com/api/phim-moi-cap-nhat?page=";
const BATCH_SIZE = 10; // số request song song mỗi lần

// Hàm crawl 1 trang
const crawlPage = async (page) => {
  const res = await axios.get(API_URL + page);
  const data = res.data;

  if (!data.status) {
    console.error(`❌ Lỗi khi crawl page ${page}:`, data.msg);
    return;
  }

  const ops = data.movies.map((movie) => ({
    updateOne: {
      filter: { id: movie.id },
      update: { $set: movie },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Movie.bulkWrite(ops);
  }

  console.log(`✅ Xong trang ${page} (${ops.length} movies)`);
};

const crawl = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected!");

    // Lấy số trang
    const firstRes = await axios.get(API_URL + 1);
    const totalPages = firstRes.data.page.last_page;
    console.log(`📄 Tổng số trang: ${totalPages}`);

    // Chia batch
    for (let i = 1; i <= totalPages; i += BATCH_SIZE) {
      const batch = [];
      for (let j = i; j < i + BATCH_SIZE && j <= totalPages; j++) {
        batch.push(crawlPage(j));
      }
      await Promise.all(batch);
      console.log(
        `🚀 Xong batch từ trang ${i} → ${Math.min(
          i + BATCH_SIZE - 1,
          totalPages
        )}`
      );
    }

    console.log("🎉 Crawl toàn bộ xong!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

async function notifyAllUsers(newVideo) {
  try {
    // Lấy toàn bộ user
    const users = await User.find({}, { userUid: 1 }).lean();

    if (users.length === 0) return;

    const ops = users.map((u) => ({
      insertOne: {
        document: {
          userUid: u.userUid,
          content: {
            type: "new_video",
            ...newVideo,
          },
          timestamp: new Date(),
        },
      },
    }));

    await Noti.bulkWrite(ops);

    console.log(`Đã gửi thông báo cho ${users.length} user`);
  } catch (err) {
    console.error("Lỗi gửi thông báo:", err);
  }
}
const crawlLatest = async () => {
  try {
    const page = 1;
    const res = await axios.get(API_URL + page);
    const data = res.data;

    if (!data.status) {
      console.error(`loi khi crawl ${page}:`, data.msg);
      return;
    }

    const newMovies = data.movies;

    // Lấy toàn bộ id trong batch crawl
    const ids = newMovies.map((m) => m.id);

    // Tìm xem trong DB đã có movie nào với id này chưa
    const existing = await Movie.find({ id: { $in: ids } }, { id: 1 }).lean();
    const existingIds = new Set(existing.map((m) => m.id));

    // Lọc ra những movie chưa có
    const freshMovies = newMovies.filter((m) => !existingIds.has(m.id));

    if (freshMovies.length > 0) {
      new Notification({
        title: "Video mới cập nhật",
        body: `Có ${freshMovies.length} video mới vừa được cập nhật!`,
        silent: false,
      }).show();
    }

    // Lưu tất cả movie vào DB (update hoặc insert)
    const ops = newMovies.map((movie) => ({
      updateOne: {
        filter: { id: movie.id },
        update: { $set: movie },
        upsert: true,
      },
    }));

    if (ops.length > 0) {
      await Movie.bulkWrite(ops);
    }
    for (const movie of freshMovies) {
      await notifyAllUsers(movie);
    }
    // trả về danh sách mới
  } catch (err) {
    consloe.log(err);
  }
};

module.exports = {
  crawl,
  crawlLatest,
};
