const axios = require("axios");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db.js");
const Actor = require("../model/actor.schema.js");
const Movie = require("../model/movie.schema.js");
const API_URL = "https://iptv.nangcucz.link/actors/nangcuc?page=";
const BATCH_SIZE = 3; // số request song song mỗi lần

// Hàm crawl 1 trang
const crawlPage = async (page) => {
  const res = await axios.get(API_URL + page);
  const data = res.data;

  const ops = data.groups[0].groups.map((actor) => ({
    updateOne: {
      filter: { id: actor.id },
      update: { $set: actor },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Actor.bulkWrite(ops);
  }

  console.log(`✅ Xong trang ${page} (${ops.length} actor)`);
};

const crawl = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected!");

    // Lấy số trang
    const firstRes = await axios.get(API_URL + 1);
    const totalPages = firstRes.data.load_more.pageInfo.last_page;
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

const a = async () => {
  await connectDB();
  const usedActorIds = await Movie.distinct("actors");

  const ok = await Actor.deleteMany({
    name: { $nin: usedActorIds },
  });
  console.log(ok);
};
// a();
module.exports = {
  crawl,
};
