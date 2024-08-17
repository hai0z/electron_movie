import { Pagination } from "@nextui-org/pagination";
import { useNavigate } from "react-router-dom";

interface Props {
  total: number;
  initialPage: number;
  page: number;
  to?: string;
}
export default function App({ total, initialPage, page, to }: Props) {
  const navigate = useNavigate();
  return (
    <Pagination
      classNames={{
        item: "w-8 h-8 text-small rounded-md bg-[oklch(var(--b3))] text-[oklch(var(--bc))]",
        cursor: "bg-[oklch(var(--p))] text-[oklch(var(--pc))]",
        next: "w-8 h-8 text-small rounded-md bg-[oklch(var(--b3))] text-[oklch(var(--bc))]",
        prev: "w-8 h-8 text-small rounded-md bg-[oklch(var(--b3))] text-[oklch(var(--bc))] ",
      }}
      showControls
      total={total}
      page={page}
      initialPage={initialPage}
      onChange={(index) => {
        navigate(`?page=${index}&${to}`);
      }}
    />
  );
}
