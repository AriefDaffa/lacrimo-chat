"use client";

import { FormEvent, useCallback } from "react";
import { FiSend } from "react-icons/fi";

import Card from "@/app/_components/Card";
import Flexer from "@/app/_components/Flexer";
import useChatSocket from "../../_hooks/useChatSocket";
import { useChatContext } from "../../_contexts/ChatContext";
import { useUserProfile } from "../../_contexts/UserProfileContext";
import Header from "./Header";
import Chat from "./Chat";
import useMsgListSocket from "../../_hooks/useMsgListSocket";
import { useMsgList } from "../../_contexts/MsgListContext";

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

  const { triggerSend } = useMsgListSocket(selectedUser.id);
  const { setMessageList } = useMsgList();

  const handleCloseChat = useCallback(() => {
    closeSocket();
    handleSelectChat({ id: 0, email: "", username: "", imageURL: "" });
  }, [closeSocket, handleSelectChat]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const submittedData = {
        data: [
          {
            users: {
              id: selectedUser.id,
              username: selectedUser.username,
            },
            messages: {
              message: chatKeyword,
            },
          },
        ],
      };

      handleChatSubmit();
      triggerSend();
      setMessageList(submittedData);
    },
    [chatKeyword, handleChatSubmit, selectedUser, setMessageList, triggerSend],
  );

  return selectedUser.id === 0 || !selectedUser.id ? (
    <div className="flex size-full items-center justify-center">
      Start chatting!
    </div>
  ) : (
    <Card isChatCard>
      <Flexer className="size-full">
        <Header
          email={selectedUser.email}
          username={selectedUser.username}
          user={selectedUser}
          handleChatClose={handleCloseChat}
        />
        <Chat oldMsg={oldMsg} currentMsg={currentMsg} profile={profile} />
        <div className="">
          <form
            onSubmit={handleSubmit}
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
            <div
              onClick={handleSubmit}
              className="flex cursor-pointer items-center justify-center rounded-full bg-blue-600 p-3 text-white"
            >
              <FiSend className="mt-[1px]" />
            </div>
          </form>
        </div>
      </Flexer>
    </Card>
  );
};

export default RightSection;
