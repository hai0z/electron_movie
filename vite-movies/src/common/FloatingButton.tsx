import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <div
        className="tooltip tooltip-top  fixed bottom-10 right-6 z-[999] transition-all duration-150"
        data-tip="Lên đầu trang"
      >
        <button
          onClick={scrollToTop}
          className="btn btn-primary btn-circle   shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    )
  );
}
