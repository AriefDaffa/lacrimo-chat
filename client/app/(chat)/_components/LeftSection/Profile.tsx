"use client";

import Image from "next/image";
import { type FC } from "react";

import Flexer from "@/app/_components/Flexer";
import type { IUser } from "../../_types/IUser";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ProfileProps {
  profile?: IUser | null;
  isLoading: boolean;
  error: string;
}

const Profile: FC<ProfileProps> = ({ profile }) => {
  return (
    <Flexer flexDirection="row" gap="4" className="items-center">
      <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
        {!profile?.imageURL ? (
          <div className="flex size-full items-center justify-center font-semibold">
            {profile?.username.charAt(0)}
          </div>
        ) : (
          <Image
            src={profile.imageURL}
            alt=""
            width={100}
            height={100}
            className="size-full object-cover"
            suppressHydrationWarning
          />
        )}
      </div>
      <div className="flex-1">
        <div className="text-lg font-semibold">{profile?.username}</div>
        <div className="text-sm text-c-gray-text">{profile?.email}</div>
      </div>
      <BsThreeDotsVertical className="mr-2" />
    </Flexer>
  );
};

export default Profile;
