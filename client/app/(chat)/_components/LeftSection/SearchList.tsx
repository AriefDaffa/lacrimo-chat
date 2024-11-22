"use client";

import Image from "next/image";
import { useMemo, type FC } from "react";

import Flexer from "@/app/_components/Flexer";
import { IUser } from "../../_types/IUser";
import { useChatContext } from "../../_contexts/ChatContext";

interface SearchListProps {
  user: IUser;
}

const SearchList: FC<SearchListProps> = ({ user }) => {
  const { handleSelectChat } = useChatContext();

  const randomImageId = useMemo(() => Math.floor(Math.random() * 101) || 1, []);

  return (
    <Flexer
      flexDirection="row"
      gap="4"
      className="cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
      onClick={() => handleSelectChat(user)}
    >
      <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
        <Image
          src={`https://picsum.photos/id/${randomImageId}/200/300`}
          alt=""
          width={100}
          height={100}
          className="size-full object-cover"
          suppressHydrationWarning
        />
      </div>
      <div className="">
        <div className="text-lg font-semibold">{user.username}</div>
        <div className="text-sm text-c-gray-text">{user.email}</div>
      </div>
    </Flexer>
  );
};

export default SearchList;
