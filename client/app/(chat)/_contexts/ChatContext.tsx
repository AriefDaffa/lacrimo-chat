"use client";

import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import type { IChatContext } from "../_types/IChatContext";
import type { IUser } from "../_types/IUser";

const ChatContext = createContext<IChatContext | undefined>(undefined);

export const ChatContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedUser, setSelectedUser] = useState<IUser>({
    id: 0,
    email: "",
    username: "",
    imageURL: "",
  });

  const handleSelectChat = useCallback((props: IUser) => {
    setSelectedUser(props);
  }, []);

  return (
    <ChatContext.Provider value={{ handleSelectChat, selectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatContext must be used within a UserProfileProvider");
  }
  return context;
};
