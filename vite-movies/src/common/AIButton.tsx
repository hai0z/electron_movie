import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Movie } from "../devils-mode/types/vietsub";
import { VietSubCard } from "../devils-mode/components/VietSubCard";

export default function AIButton() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const [showAI, setShowAI] = useState(false);
  const [showTransition, setShowTransition] = useState(false); // 👈 thêm state
  const [loading, setLoading] = useState(false);

  const [all, setAll] = React.useState<Movie[]>([]);

  const electron = (window as any).electron;

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const fetchAI = async () => {
    setLoading(true);
    setAll([]);
    try {
      electron.ipcRenderer.send("recommend");

      electron.ipcRenderer.on("recommend-data", (data: Movie[]) => {
        setAll(data);
      });
    } catch (e) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const openAI = () => {
    setShowTransition(true); // show hiệu ứng trước
    setTimeout(() => {
      setShowTransition(false);
      setShowAI(true);
      fetchAI();
    }, 1500); // chạy 1.5s rồi mở AI
  };

  if (location.pathname !== "/") return null;

  return (
    <>
      {/* Hiệu ứng mở đầu */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-primarys"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-5xl font-bold text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              ✨ AI Power Up!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay AI */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-gradient-to-br from-primarys via-accent to-neutral flex items-center justify-center overflow-hidden mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div
              className="absolute inset-0 "
              style={{
                background:
                  "linear-gradient(270deg, #a78bfa, #60a5fa, #34d399, #f472b6, #a78bfa)",
                backgroundSize: "400% 400%",
                filter: "blur(8px)", // làm glow
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            {/* Background hiệu ứng */}

            {/* Content */}
            <div className="relative z-10 max-w-5xl text-center p-6">
              {loading && (
                <motion.h1
                  className="text-3xl font-bold text-white drop-shadow-xl animate-pulse"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  ✨ AI đang suy nghĩ...
                </motion.h1>
              )}

              {!loading && all && (
                <motion.div
                  className="backdrop-blur-md rounded-2xl p-6 "
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <p className="text-2xl font-bold my-4 text-white">
                    Video dành cho bạn
                  </p>
                  <motion.div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                    {all.map((post) => (
                      <VietSubCard key={post.id} m={post} />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Nút đóng */}
            <button
              onClick={() => {
                setShowAI(false);
              }}
              className="absolute top-12 right-6 btn btn-circle btn-sm bg-white/20 border-0 hover:bg-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div
        className="tooltip tooltip-top fixed z-[99] transition-all duration-150"
        data-tip="Gợi ý video"
        style={{
          bottom: visible ? 96 : 40,
          right: 24,
        }}
      >
        <button
          onClick={openAI}
          className="btn btn-primary btn-circle shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-primary-content animate-pulse" />
        </button>
      </div>
    </>
  );
}
