export interface IMessengerList {
  messages: Messages;
  users: Users;
}

interface Users {
  id: number;
  username: string;
  email: string;
}
interface Messages {
  id: number;
  roomId: number;
  sender: number;
  receiver: number;
  message: string;
  createdAt: string;
}
