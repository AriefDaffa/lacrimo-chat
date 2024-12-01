import { IUser } from "./IUser";

export interface IMessengerList {
  messages: Messages;
  users: IUser;
}

interface Messages {
  id: number;
  roomId: number;
  sender: number;
  receiver: number;
  message: string;
  createdAt: string;
}
