import { useEffect, useMemo, useState } from "react";
import { useHistoryStore } from "../../zustand/useHistoryStore";
import { Link } from "react-router-dom";

interface IOpenAppData {
  date: string;
  count: number;
}

const StatisticsPage = () => {
  let { history } = useHistoryStore();

  history = history.filter((item) => item.id);

  const [openAppData, setOpenAppData] = useState<IOpenAppData[]>([]);

  const ipcRenderer = (window as any).electron.ipcRenderer;

  // Lấy ngày hôm nay
  const today = new Date().toISOString().split("T")[0];

  // Số lần mở hôm nay
  const todayOpen = openAppData.find((d) => d.date === today)?.count ?? 0;

  // 7 ngày gần nhất (tính từ hôm nay)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  // Tổng số lần mở 7 ngày gần nhất
  const total7Days = last7Days.reduce((sum, day) => {
    const dayData = openAppData.find((d) => d.date === day);
    return sum + (dayData?.count ?? 0);
  }, 0);

  const stats = useMemo(() => {
    const totalVideos = history.length;
    const totalTime = history.reduce(
      (sum, item) => sum + (item.stayIn || 0),
      0
    );
    const actorCount: { [actor: string]: number } = {};
    const tagCount: { [tag: string]: number } = {};
    const dayCount: { [day: string]: number } = {};

    history.forEach((item) => {
      // actor
      actorCount[item.actor] = (actorCount[item.actor] || 0) + 1;

      // tag
      item.tag.split(",").forEach((t) => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });

      // day
      const day = new Date(item.watchedAt).toISOString().split("T")[0];
      dayCount[day] = (dayCount[day] || 0) + 1;
    });

    const topActors = Object.entries(actorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const byDay = Object.entries(dayCount)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7); // Chỉ hiển thị 7 ngày gần nhất

    return { totalVideos, totalTime, topActors, topTags, byDay };
  }, [history]);

  // Thống kê app opens theo ngày (7 ngày gần nhất)
  const appOpensByDay = useMemo(() => {
    return last7Days
      .map((day) => {
        const dayData = openAppData.find((d) => d.date === day);
        return [day, dayData?.count ?? 0] as [string, number];
      })
      .reverse(); // Đảo ngược để hiển thị từ cũ đến mới
  }, [openAppData, last7Days]);

  useEffect(() => {
    ipcRenderer.send("get-open-app");
    ipcRenderer.on("open-app-data", (result: any) => {
      setOpenAppData(result);
    });
  }, []);

  const formatTime = (seconds = 0) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    } else {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    }
  };

  const getProgressColor = (index = 0) => {
    const colors = [
      "progress-primary",
      "progress-secondary",
      "progress-accent",
      "progress-info",
      "progress-success",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header Section */}
      <div className="hero bg-primarys text-primary-content py-12">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">📊 Dashboard</h1>
            <p className="mb-5 text-xl opacity-90 text-primary-content">
              Thống kê chi tiết lịch sử xem của bạn
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 -mt-6 pb-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="stats ">
            <div className="stat bg-gradient-to-r from-primarys to-primarys-focus text-primarys-content">
              <div className="stat-figure">
                <div className="text-4xl opacity-80">🎬</div>
              </div>
              <div className="stat-title text-primary-content opacity-80">
                Tổng Videos
              </div>
              <div className="stat-value text-primary-content">
                {stats.totalVideos.toLocaleString()}
              </div>
              <div className="stat-desc text-primary-content opacity-60">
                videos đã xem
              </div>
            </div>
          </div>

          <div className="stats ">
            <div className="stat bg-gradient-to-r from-secondarys to-secondarys-focus text-secondarys-content">
              <div className="stat-figure">
                <div className="text-4xl opacity-80">⏰</div>
              </div>
              <div className="stat-title text-secondary-content opacity-80">
                Thời Gian
              </div>
              <div className="stat-value text-2xl text-secondary-content">
                {formatTime(stats.totalTime)}
              </div>
              <div className="stat-desc text-secondary-content opacity-60">
                tổng thời gian xem
              </div>
            </div>
          </div>

          {/* Open App Card */}
          <div className="stats ">
            <div className="stat bg-gradient-to-r from-accent to-accent-focus text-accent-content">
              <div className="stat-figure">
                <div className="text-4xl opacity-80">🚀</div>
              </div>
              <div className="stat-title text-accent-content opacity-80">
                Số Lần Mở App Hôm Nay
              </div>
              <div className="stat-value text-accent-content">{todayOpen}</div>
              <div className="stat-desc text-accent-content opacity-60">
                Tổng 7 ngày: {total7Days}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Actors */}
          <div className="card bg-base-100 card-bordered">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🌟</div>
                <h2 className="card-title text-2xl">Top Actors</h2>
              </div>

              <div className="space-y-4">
                {stats.topActors.map(([actor, count], idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span className="text-sm font-bold">#{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <Link
                          to={`/actor-movie?actor=${actor}`}
                          className="font-semibold text-base hover:underline"
                        >
                          {actor}
                        </Link>
                        <span className="badge badge-primary badge-lg">
                          {count}
                        </span>
                      </div>
                      <progress
                        className={`progress w-full ${getProgressColor(idx)}`}
                        value={count}
                        max={stats.topActors[0][1]}
                      ></progress>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tags */}
          <div className="card bg-base-100 card-bordered">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🏷️</div>
                <h2 className="card-title text-2xl">Top Tags</h2>
              </div>

              <div className="space-y-4">
                {stats.topTags.map(([tag, count], idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span className="text-sm font-bold">#{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-base">{tag}</span>
                        <span className="badge badge-secondary badge-lg">
                          {count}
                        </span>
                      </div>
                      <progress
                        className={`progress w-full ${getProgressColor(idx)}`}
                        value={count}
                        max={stats.topTags[0][1]}
                      ></progress>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Daily Video Activity Chart */}
          <div className="card bg-base-100 card-bordered">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">📅</div>
                <h2 className="card-title text-2xl">
                  Video đã xem - 7 ngày gần nhất
                </h2>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {stats.byDay.map(([day, count], idx) => {
                  const date = new Date(day);
                  const dayName = date.toLocaleDateString("vi-VN", {
                    weekday: "short",
                  });
                  const dayNum = date.getDate();
                  const maxCount = Math.max(...stats.byDay.map(([_, c]) => c));
                  const percentage =
                    maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300"
                    >
                      <div className="text-xs opacity-60 mb-1">{dayName}</div>
                      <div className="text-sm font-bold mb-2">{dayNum}</div>

                      <div className="flex-1 flex items-end h-16">
                        <div
                          className="w-6 bg-gradient-to-t from-primarys to-primarys-focus rounded-t-md transition-all duration-500"
                          style={{ height: `${Math.max(percentage, 5)}%` }}
                        ></div>
                      </div>

                      <div className="mt-2 text-center">
                        <div className="text-xs font-semibold">{count}</div>
                        <div className="text-xs opacity-60">video</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily App Opens Chart */}
          <div className="card bg-base-100 card-bordered">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🚀</div>
                <h2 className="card-title text-2xl">
                  Mở app - 7 ngày gần nhất
                </h2>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {appOpensByDay.map(([day, count], idx) => {
                  const date = new Date(day);
                  const dayName = date.toLocaleDateString("vi-VN", {
                    weekday: "short",
                  });
                  const dayNum = date.getDate();
                  const maxCount = Math.max(
                    ...appOpensByDay.map(([_, c]) => c)
                  );
                  const percentage =
                    maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300"
                    >
                      <div className="text-xs opacity-60 mb-1">{dayName}</div>
                      <div className="text-sm font-bold mb-2">{dayNum}</div>

                      <div className="flex-1 flex items-end h-16">
                        <div
                          className="w-6 bg-gradient-to-t from-accent to-accent-focus rounded-t-md transition-all duration-500"
                          style={{ height: `${Math.max(percentage, 5)}%` }}
                        ></div>
                      </div>

                      <div className="mt-2 text-center">
                        <div className="text-xs font-semibold">{count}</div>
                        <div className="text-xs opacity-60">lần</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        {history.length > 0 && (
          <div className="mt-8">
            <div className="alert alert-info ">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h3 className="font-bold">Thống kê thú vị!</h3>
                  <div className="text-xs">
                    Bạn đã xem trung bình{" "}
                    {formatTime(
                      Math.round(stats.totalTime / stats.totalVideos)
                    )}{" "}
                    trong mỗi video
                    {stats.topActors.length > 0 &&
                      ` • Diễn viên yêu thích: ${stats.topActors[0][0]}`}
                    {` • Bạn đã mở ứng dụng ${todayOpen} lần hôm nay!`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
