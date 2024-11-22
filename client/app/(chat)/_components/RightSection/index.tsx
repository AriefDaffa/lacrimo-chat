"use client";

import Image from "next/image";
import { useMemo } from "react";
import { FiSend } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

import Card from "@/app/_components/Card";
import Flexer from "@/app/_components/Flexer";
import { useChatContext } from "../../_contexts/ChatContext";
import useChatSocket from "../../_hooks/useChatSocket";
import { useUserProfile } from "../../_contexts/UserProfileContext";

const RightSection = () => {
  const { selectedUser, handleSelectChat } = useChatContext();

  const {
    oldMsg,
    currentMsg,
    chatKeyword,
    handleChatSubmit,
    handleOnChange,
    closeSocket,
  } = useChatSocket(selectedUser.id);
  const { profile } = useUserProfile();

  const randomImageId = useMemo(() => Math.floor(Math.random() * 101) || 1, []);

  const handleCloseChat = () => {
    closeSocket();
    handleSelectChat({ id: 0, email: "", username: "" });
  };

  return (
    <Card isChatCard>
      {selectedUser.id === 0 || !selectedUser.id ? (
        <div className="flex size-full items-center justify-center">
          Start chatting!
        </div>
      ) : (
        <Flexer className="size-full">
          <div className="p-4">
            <Flexer
              flexDirection="row"
              className="items-center justify-between"
            >
              <Flexer flexDirection="row" gap="4">
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
                <Flexer className="flex-1 justify-center">
                  <div className="text-lg font-semibold">
                    {selectedUser?.username}
                  </div>
                  <div className="text-sm text-c-gray-text">
                    {selectedUser?.email}
                  </div>
                </Flexer>
              </Flexer>
              <IoMdClose
                className="mr-4 cursor-pointer"
                size={20}
                onClick={handleCloseChat}
              />
            </Flexer>
          </div>
          <div className="flex-1 overflow-auto px-4">
            <div className="flex flex-col gap-2 pb-2">
              {oldMsg.map((item, id) =>
                item.senderID !== Number(profile?.id) ? (
                  <div
                    key={`${item.message}-${id}`}
                    className="w-fit max-w-[50%] rounded-md bg-c-gray p-2"
                  >
                    {item.message}
                  </div>
                ) : (
                  <div
                    key={`${item.message}-${id}`}
                    className="w-fit max-w-[50%] self-end rounded-md bg-blue-200 p-2"
                  >
                    {item.message}
                  </div>
                ),
              )}
              {currentMsg
                .filter((item) => item.senderID)
                .map((item, id) =>
                  item.senderID !== Number(profile?.id) ? (
                    <div
                      key={`${item.message}-${id}`}
                      className="w-fit max-w-[50%] rounded-md bg-c-gray p-2"
                    >
                      {item.message}
                    </div>
                  ) : (
                    <div
                      key={`${item.message}-${id}`}
                      className="w-fit max-w-[50%] self-end rounded-md bg-blue-200 p-2"
                    >
                      {item.message}
                    </div>
                  ),
                )}
            </div>
          </div>
          <div className="">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChatSubmit();
              }}
              className="flex items-center gap-4 border-t p-4"
            >
              <div className="flex-1">
                <input
                  value={chatKeyword}
                  className="size-full rounded-full bg-c-gray px-4 py-3 outline-none"
                  type="text"
                  placeholder="Write a message..."
                  onChange={handleOnChange}
                />
              </div>
              {/* <div className="">1</div> */}
              <div className="flex cursor-pointer items-center justify-center rounded-full bg-blue-600 p-3 text-white">
                <FiSend className="mt-[1px]" />
              </div>
            </form>
          </div>
        </Flexer>
      )}
    </Card>
  );
};

export default RightSection;
