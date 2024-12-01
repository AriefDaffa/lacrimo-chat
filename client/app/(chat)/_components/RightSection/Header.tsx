"use client";

import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { type FC } from "react";

import Flexer from "@/app/_components/Flexer";
import { IUser } from "../../_types/IUser";

interface HeaderProps {
  username: string;
  email: string;
  user: IUser;
  handleChatClose: () => void;
}

const Header: FC<HeaderProps> = ({ username, handleChatClose, user }) => {
  return (
    <div className="border-b p-4">
      <Flexer flexDirection="row" className="items-center justify-between">
        <Flexer flexDirection="row" gap="4" className="items-center">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
            {!user?.imageURL ? (
              <div className="flex size-full items-center justify-center font-semibold">
                {user?.username.charAt(0)}
              </div>
            ) : (
              <Image
                src={user.imageURL}
                alt=""
                width={100}
                height={100}
                className="size-full object-cover"
                suppressHydrationWarning
              />
            )}
          </div>
          <div>
            <div className="text-lg font-semibold">{username}</div>
            {/* <div className="text-sm text-c-gray-text">{email}</div> */}
            <div className="text-sm text-c-gray-text">Online</div>
          </div>
        </Flexer>
        <IoMdClose
          className="mr-2 cursor-pointer"
          size={20}
          onClick={handleChatClose}
        />
      </Flexer>
    </div>
  );
};

export default Header;
