const connectDB = require("../config/db.js");
const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../model/movie.schema.js");

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

export const crawlLatest = async (req, res) => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected!");

    await crawlPage(1);

    console.log("🎉 Crawl toàn bộ xong!");
    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.connection.close();
  }
};
module.exports = {
  crawl,
  crawlLatest,
};
