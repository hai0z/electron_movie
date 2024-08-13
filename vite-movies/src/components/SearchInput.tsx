import React from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
const SearchInput = () => {
  const navigation = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = () => {
    if (searchValue) {
      navigation(`/search/${searchValue}?page=1`, {
        replace: true,
      });
    }
  };

  return (
    <label className="input input-bordered flex items-center gap-2">
      <input
        type="text"
        className="grow"
        placeholder="Tìm kiếm phim..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      {!searchValue.length ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-6 w-6 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <IoCloseOutline
          size={24}
          onClick={() => setSearchValue("")}
          className="cursor-pointer"
        />
      )}
    </label>
  );
};

export default SearchInput;
