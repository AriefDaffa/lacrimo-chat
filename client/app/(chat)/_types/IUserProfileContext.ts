import { IUser } from "./IUser";

export interface IUserProfileContext {
  profile: IUser | null;
  loading: boolean;
  error: string;
  refreshProfile: () => void;
}
