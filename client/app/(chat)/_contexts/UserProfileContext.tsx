"use client";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { currentUser } from "../_services/current-user";
import type { IUser } from "../_types/IUser";
import type { IUserProfileContext } from "../_types/IUserProfileContext";

const UserProfileContext = createContext<IUserProfileContext | undefined>(
  undefined,
);

export const UserProfileProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchUserProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await currentUser();
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data: IUser = await response.json();
      setProfile(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Internal Server Error");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{ profile, loading, error, refreshProfile: fetchUserProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
