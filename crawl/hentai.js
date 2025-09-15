const axios = require("axios");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db.js");
const Hentai = require("../model/hentai.schema.js");
const API_URL = `https://ihentai.ws/api/search?limit=50&orderby=date&order=desc&page=`;
const BATCH_SIZE = 3; // số request song song mỗi lần

// Hàm crawl 1 trang
const crawlPage = async (page) => {
  const res = await fetch(API_URL + page);
  const data = await res.json();

  const ops = data.videos.map((hentai) => ({
    updateOne: {
      filter: { id: hentai.id },
      update: { $set: hentai },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Hentai.bulkWrite(ops);
  }

  console.log(`✅ Xong trang ${page} (${ops.length} hentai)`);
};

const crawl = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected!");

    // Lấy số trang
    const firstRes = await fetch(API_URL + 1);
    const firstData = await firstRes.json();
    // API không trả về tổng số trang, nên tính thủ công
    // Mỗi trang có 24 mục
    const totalPages = Math.ceil(firstData.count / 24);
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
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

const crawlLatest = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected!");
    await crawlPage(1);
    console.log("🎉 Crawl trang mới nhất xong!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
module.exports = {
  crawl,
  crawlLatestHentai: crawlLatest,
};
