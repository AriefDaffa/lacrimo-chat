import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { connectChatSocket } from "../_services/connect-chat-socket";
import type { IMessage } from "../_types/IMessage";

const useChatSocket = (id: number) => {
  const socket = useRef<WebSocket | null>(null);

  const [oldMsg, setOldMsg] = useState<IMessage[]>([]);
  const [currentMsg, setCurrentMsg] = useState<IMessage[]>([]);
  const [chatKeyword, setChatKeyword] = useState("");

  const handleChatSubmit = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(chatKeyword);
      setChatKeyword("");
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  }, [chatKeyword]);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setChatKeyword(e.target.value);
  }, []);

  const closeSocket = useCallback(() => {
    setCurrentMsg([]);
    setOldMsg([]);
    socket.current?.close();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const req = await connectChatSocket(id);

      if (req.status < 300) {
        const resp = await req.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resp.data.messages.forEach((item: any) => {
          setOldMsg((prev) => [
            ...prev,
            { senderID: item.sender, message: item.message },
          ]);
        });
      }
    };

    setCurrentMsg([]);
    setOldMsg([]);
    if (!id || id === 0) {
      return;
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    setCurrentMsg([]);
    setOldMsg([]);
    if (!id || id === 0) {
      return;
    }

    socket.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/v1/chat?id=${id}`,
    );

    socket.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.current.onmessage = (e) => {
      const parsedData = JSON?.parse(e?.data || "{}");
      setCurrentMsg((prev) => [
        ...prev,
        {
          senderID: parsedData?.senderID,
          message: parsedData?.message,
        },
      ]);
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
  }, [id]);

  return {
    oldMsg,
    currentMsg,
    chatKeyword,
    handleOnChange,
    handleChatSubmit,
    closeSocket,
  };
};

export default useChatSocket;
