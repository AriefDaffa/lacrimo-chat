"use client";

import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useMemo, type FC } from "react";

import Flexer from "@/app/_components/Flexer";

interface HeaderProps {
  username: string;
  email: string;
  handleChatClose: () => void;
}

const Header: FC<HeaderProps> = ({ email, username, handleChatClose }) => {
  const randomImageId = useMemo(() => Math.floor(Math.random() * 101) || 1, []);

  return (
    <div className="border-b p-4">
      <Flexer flexDirection="row" className="items-center justify-between">
        <Flexer flexDirection="row" gap="4" className="items-center">
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
          <div>
            <div className="text-lg font-semibold">{username}</div>
            <div className="text-sm text-c-gray-text">{email}</div>
          </div>
        </Flexer>
        <IoMdClose
          className="mr-4 cursor-pointer"
          size={20}
          onClick={handleChatClose}
        />
      </Flexer>
    </div>
  );
};

export default Header;
