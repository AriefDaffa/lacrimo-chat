import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { connectChatSocket } from "../_services/connect-chat-socket";

const useChatSocket = (id: number) => {
  const socket = useRef<WebSocket | null>(null);

  const [oldMsg, setOldMsg] = useState<{ senderID: number; message: string }[]>(
    [],
  );
  const [currentMsg, setCurrentMsg] = useState<
    { senderID: number; message: string }[]
  >([]);
  //   const [currUserID, setCurrUserID] = useState(0);
  const [chatKeyword, setChatKeyword] = useState("");

  const handleChatSubmit = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(chatKeyword);
      setChatKeyword("");
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  }, [chatKeyword]);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setChatKeyword(e.target.value);
  }, []);

  const closeSocket = useCallback(() => {
    socket.current?.close();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const req = await connectChatSocket(id);

      if (req.status < 300) {
        const resp = await req.json();
        // setCurrUserID(resp?.data.user.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resp.data.messages.forEach((item: any) => {
          setOldMsg((prev) => [
            ...prev,
            { senderID: item.sender, message: item.message },
          ]);
        });
      }
    };

    if (!id || id === 0) {
      return;
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id || id === 0) {
      return;
    }

    socket.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/v1/chat?id=${id}`,
      [
        "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MywidXNlcm5hbWUiOiJUZXN0IDEiLCJlbWFpbCI6ImFAbWFpbC5jb20iLCJleHAiOjE3MzI0OTAwMTZ9.Blqbxcbh5Ts99PvBD134Ou9bd2m5D9WA6abiEvlBCfE",
      ],
    );

    socket.current.onopen = () => {
      //   setIsConnected(true);
      console.log("WebSocket connection established");
    };

    socket.current.onmessage = (e) => {
      const parsedData = JSON.parse(e.data);
      setCurrentMsg((prev) => [
        ...prev,
        {
          senderID: parsedData?.senderID,
          message: parsedData?.message,
        },
      ]);
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      //   setIsConnected(false);
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
