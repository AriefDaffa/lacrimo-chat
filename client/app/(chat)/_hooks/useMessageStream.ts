import { useEffect, useState } from "react";

const useMessageStream = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  //   const { onError, onOpen } = options || {};

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_HOST}/v1/rooms/stream`,
      { withCredentials: true },
    );

    // Handle open event
    eventSource.onopen = () => {
      setIsConnected(true);
      //   if (onOpen) onOpen();
    };

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      setMessages(JSON.parse(event?.data || "{}"));
    };

    // Handle errors
    eventSource.onerror = () => {
      setIsConnected(false);
      //   if (onError) onError(error);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return { messages, isConnected };
};

export default useMessageStream;
