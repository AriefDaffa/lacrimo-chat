import type { FC } from "react";

import Flexer from "@/app/_components/Flexer";
import Image from "next/image";
import { useChatContext } from "../../_contexts/ChatContext";
import type { IUser } from "../../_types/IUser";

interface ChatListProps {
  users: IUser;
  username: string;
  message: string;
}

const ChatList: FC<ChatListProps> = ({ message, username, users }) => {
  const { handleSelectChat } = useChatContext();
  return (
    <>
      <Flexer
        flexDirection="row"
        className="cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
        onClick={() => handleSelectChat(users)}
      >
        <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
          <Image
            src={`https://picsum.photos/id/${Math.floor(Math.random() * 101) || 1}/200/300`}
            alt=""
            width={100}
            height={100}
            className="size-full object-cover"
            suppressHydrationWarning
          />
        </div>
        <Flexer className="gap-1">
          <div className="font-semibold">{username}</div>
          <div className="text-sm">{message}</div>
        </Flexer>
      </Flexer>
      {/* <div className="h-[1px] w-full bg-gray-200"></div> */}
    </>
  );
};

export default ChatList;
