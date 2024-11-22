import { IUser } from "./IUser";

export interface IChatContext {
  selectedUser: IUser;
  handleSelectChat: (props: IUser) => void;
}
