"use client";

import Image from "next/image";
import { useMemo, type FC } from "react";

import Flexer from "@/app/_components/Flexer";
import type { IUser } from "../../_types/IUser";

interface ProfileProps {
  profile?: IUser | null;
  isLoading: boolean;
  error: string;
}

const Profile: FC<ProfileProps> = ({ profile }) => {
  const randomImageId = useMemo(() => Math.floor(Math.random() * 101) || 1, []);
  return (
    <Flexer flexDirection="row" gap="4" className="items-center">
      <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
        <Image
          src={`https://picsum.photos/id/${randomImageId}/200/300`}
          alt=""
          width={100}
          height={100}
          className="size-full object-cover"
          suppressHydrationWarning
        />
      </div>
      <div className="">
        <div className="text-lg font-semibold">{profile?.username}</div>
        <div className="text-sm text-c-gray-text">{profile?.email}</div>
      </div>
    </Flexer>
  );
};

export default Profile;
