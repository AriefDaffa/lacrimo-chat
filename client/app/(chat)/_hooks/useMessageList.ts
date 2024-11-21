import { useEffect, useState } from "react";

import { messageList } from "../_services/message-list";
import { IMessengerList } from "../_types/IMessengerList";

const useMessageList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [data, setData] = useState<{
    success: boolean;
    message: string;
    rooms: IMessengerList[];
  }>();

  useEffect(() => {
    const userMessageList = async () => {
      setIsLoading(true);
      setErrMsg("");

      const req = await messageList();

      const resp = await req.json();

      setIsLoading(false);

      if (req.status < 300) {
        setData(resp);
        // navigate.replace("/");
      } else {
        setErrMsg(resp?.message || "Internal Server Error");
      }
    };

    userMessageList();
  }, []);

  return { data, isLoading, errMsg };
};

export default useMessageList;
