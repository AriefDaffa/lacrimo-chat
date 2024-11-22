import { IUser } from "./IUser";

export interface IUserSearch {
  success: boolean;
  message: string;
  data: IUser[] | null;
}
