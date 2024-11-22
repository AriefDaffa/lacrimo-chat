import { FiSearch } from "react-icons/fi";
import type { ChangeEvent, FC } from "react";

import Flexer from "@/app/_components/Flexer";

interface SearchInputProps {
  keyword: string;
  handleKeywordChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: FC<SearchInputProps> = ({
  keyword,
  handleKeywordChange,
}) => {
  return (
    <Flexer flexDirection="row" className="items-center rounded-md border px-3">
      <FiSearch size={20} className="text-gray-400" />
      <input
        value={keyword}
        type="text"
        className="w-full py-2 outline-none"
        placeholder="Search users"
        onChange={handleKeywordChange}
      />
    </Flexer>
  );
};

export default SearchInput;
