/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import type { IMsgListContext } from "../_types/IMsgListContext";
import type { IMessengerList } from "../_types/IMessengerList";

const MsgListContext = createContext<IMsgListContext | undefined>(undefined);

export const MsgListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [msgList, setMsgList] = useState<IMessengerList[]>([]);

  const setMessageList = useCallback((parsedData: any) => {
    setMsgList((prevArray: IMessengerList[]) => {
      const { id: newUserId, username: newUsername } = parsedData.data[0].users;
      const newMessage = parsedData.data[0].messages.message;

      const index = prevArray.findIndex(
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
            users: {
              id: newUserId,
              username: newUsername,
              email: "",
              imageURL: "",
            },
            messages: {
              message: newMessage,
              id: 0,
              createdAt: "",
              receiver: 0,
              roomId: 0,
              sender: 0,
            },
          },
          ...prevArray,
        ];
      }
    });
  }, []);

  return (
    <MsgListContext.Provider
      value={{
        msgList: typeof msgList !== "undefined" ? msgList : [],
        setMsgList,
        setMessageList,
      }}
    >
      {children}
    </MsgListContext.Provider>
  );
};

export const useMsgList = () => {
  const context = useContext(MsgListContext);
  if (!context) {
    throw new Error("useMsgList must be used within a MsgListProvider");
  }
  return context;
};
