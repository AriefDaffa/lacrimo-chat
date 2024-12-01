/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

import { useMsgList } from "../_contexts/MsgListContext";

const useMsgListSocket = (receiverId?: number) => {
  const socket = useRef<WebSocket | null>(null);

  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectDelay, setReconnectDelay] = useState(1000);

  const { setMessageList, setMsgList } = useMsgList();

  const triggerSend = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send("");
    } else {
      console.log("Message List is not open. Cannot send message.");
    }
  }, []);

  const createSocketConnection = useCallback(() => {
    if (receiverId) {
      socket.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/v1/chat/list?receiverId=${receiverId}`,
      );
    } else {
      socket.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/v1/chat/list`,
      );
    }

    socket.current.onopen = () => {
      console.log("Message List connection established");
      setReconnecting(false);
      setReconnectDelay(1000);
    };

    socket.current.onmessage = (e) => {
      const parsedData = JSON?.parse(e?.data || "{}");
      if (
        parsedData?.message === "Message sent!" &&
        typeof parsedData !== "undefined"
      ) {
        setMessageList(parsedData);
      } else {
        // setMessageList([]);
        setMsgList(parsedData?.data);
      }
    };
  }, [receiverId, setMessageList, setMsgList]);

  useEffect(() => {
    createSocketConnection();

    return () => {
      socket.current?.close();
      console.log("Message List connection cleaned up");
    };
  }, [createSocketConnection]);

  return {
    // msgList: typeof msgList !== "undefined" ? msgList : [],
    reconnecting,
    reconnectDelay,
    triggerSend,
  };
};

export default useMsgListSocket;
