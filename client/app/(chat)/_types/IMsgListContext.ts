/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react";
import type { IMessengerList } from "./IMessengerList";

export interface IMsgListContext {
  msgList: IMessengerList[];
  setMsgList: Dispatch<SetStateAction<IMessengerList[]>>;
  setMessageList: (parsedData: any) => void;
}
