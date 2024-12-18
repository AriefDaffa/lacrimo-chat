import { type FC } from "react";

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
    <Flexer
      flexDirection="row"
      className="cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-100"
      onClick={() => handleSelectChat(users)}
    >
      <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200">
        {!users.imageURL ? (
          <div className="flex size-full items-center justify-center font-semibold">
            {users.username.charAt(0)}
          </div>
        ) : (
          <Image
            src={users.imageURL}
            alt=""
            width={100}
            height={100}
            className="size-full object-cover"
            suppressHydrationWarning
          />
        )}
      </div>
      <div className="flex-1">
        <div className="text-lg font-semibold">{username}</div>
        <div className="line-clamp-1 text-xs">{message}</div>
      </div>
    </Flexer>
  );
};

export default ChatList;
