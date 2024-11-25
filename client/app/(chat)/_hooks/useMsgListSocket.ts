import { useEffect, useRef, useState } from "react";

import type { IMessengerList } from "../_types/IMessengerList";

const useMsgListSocket = () => {
  const socket = useRef<WebSocket | null>(null);

  const [msgList, setMsgList] = useState<IMessengerList[]>([]);

  useEffect(() => {
    setMsgList([]);

    socket.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/v1/chat/list`,
    );

    socket.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.current.onmessage = (e) => {
      const parsedData = JSON?.parse(e?.data || "{}");

      if (parsedData?.message === "Message sent!") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMsgList((prevArray: any) => {
          const { id: newUserId, username: newUsername } =
            parsedData.data[0].users;
          const newMessage = parsedData.data[0].messages.message;

          const index = prevArray.findIndex(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) => item.users.id === newUserId,
          );

          if (index !== -1) {
            const updatedItem = {
              ...prevArray[index],
              users: { ...prevArray[index].users, username: newUsername },
              messages: { ...prevArray[index].messages, message: newMessage },
            };

            const newArray = [...prevArray];
            newArray.splice(index, 1);
            return [updatedItem, ...newArray];
          } else {
            return [
              {
                users: { id: newUserId, username: newUsername },
                messages: { message: newMessage },
              },
              ...prevArray,
            ];
          }
        });
      } else {
        setMsgList(parsedData?.data);
      }
    };

    socket.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.current?.close();
      console.log("WebSocket connection cleaned up");
    };
  }, []);

  return {
    msgList,
  };
};

export default useMsgListSocket;
