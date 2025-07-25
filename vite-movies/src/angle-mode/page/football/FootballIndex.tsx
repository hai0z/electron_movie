import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaFutbol, FaChevronRight, FaPlay } from "react-icons/fa";
import { IoFootballOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const fetchXoiLac = async (link: string) => {
  const response = await fetch(link);
  const data = await response.json();
  return data;
};

const FootballIndex = () => {
  const [currentLink] = useState<string>(
    "https://sport.xoilaczz.link/providers"
  );
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["xoilac", currentLink],
    queryFn: () => fetchXoiLac(currentLink),
    refetchInterval: 60000,
  });
  const [selectedSort, setSelectedSort] = useState<string>("all");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <div className="animate-spin text-primary mb-4">
            <FaFutbol size={40} />
          </div>
          <p className="text-lg font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-24">
      <div className="container mx-auto px-4  ">
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedSort("all")}
                className={`btn ${
                  selectedSort === "all" ? "btn-primary" : "btn-ghost"
                }`}
              >
                <IoFootballOutline size={20} />
                <span>All Matches</span>
              </button>

              {data?.sorts?.map((sort: any) => (
                <button
                  key={sort.text}
                  onClick={() =>
                    navigate(`/sport/group`, { state: { data: sort } })
                  }
                  className={`btn ${
                    selectedSort === sort.text ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  <FaFutbol size={20} />
                  <span>{sort.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 pb-8">
          {data?.groups
            ?.filter((g: any) => g.id !== "related_providers")
            ?.map((provider: any) => (
              <div key={provider.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center border-b border-base-300 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="badge badge-primary p-3">
                        <IoFootballOutline size={24} />
                      </div>
                      <h2 className="card-title">{provider.name}</h2>
                    </div>

                    {provider.display === "horizontal" && (
                      <button
                        onClick={() =>
                          navigate("/sport/details", {
                            state: {
                              data: {
                                link: provider.remote_data?.url,
                                name: provider.name,
                              },
                            },
                          })
                        }
                        className="btn btn-ghost btn-sm"
                      >
                        <span>View All</span>
                        <FaChevronRight size={14} />
                      </button>
                    )}
                  </div>

                  <div className="pt-4">
                    {provider.display === "vertical" ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {provider.channels?.map((channel: any) => (
                          <div
                            key={channel.id}
                            onClick={() =>
                              navigate("/watch-football", {
                                state: { data: channel },
                              })
                            }
                            className="card bg-base-100 cursor-pointer shadow-xl transition-shadow"
                          >
                            <figure className="relative">
                              <img
                                src={channel.image?.url}
                                alt={channel.name}
                                className="w-full aspect-video object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <FaPlay size={30} className="text-white" />
                              </div>
                            </figure>
                            <div className="card-body p-2">
                              <h3 className="card-title text-sm line-clamp-2">
                                {channel.name}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex  gap-4   overflow-x-auto">
                        {provider.channels?.map((channel: any) => (
                          <div
                            key={channel.id}
                            onClick={() =>
                              navigate("/watch", {
                                state: {
                                  link: channel.sources[0].contents[0]
                                    .streams[0].stream_links[0].url,
                                },
                              })
                            }
                            className="carousel-item w-72 cursor-pointer"
                          >
                            <div className="card ">
                              <figure className="relative">
                                <img
                                  src={channel.image?.url}
                                  alt={channel.name}
                                  className="w-full aspect-video object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <FaPlay size={30} className="text-white" />
                                </div>
                              </figure>
                              <div className="card-body p-2">
                                <h3 className="card-title text-sm line-clamp-2">
                                  {channel.name}
                                </h3>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FootballIndex;
