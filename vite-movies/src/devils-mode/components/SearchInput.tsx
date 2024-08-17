import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { useDebounce } from "../../hooks/useDebounce";
const SearchInput = () => {
  const navigation = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");

  const debounce = useDebounce(searchValue, 300);

  const handleSearch = () => {
    navigation(`/search/${debounce}?page=1`, {
      replace: true,
    });
  };
  useEffect(() => {
    if (searchValue.length > 0) handleSearch();
  }, [debounce]);

  return (
    <label className="input input-bordered flex items-center gap-2 input-sm">
      <input
        type="text"
        className="grow"
        placeholder="Tìm kiếm phim..."
        value={searchValue}
        onChange={(event) => {
          setSearchValue(event.target.value);
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
