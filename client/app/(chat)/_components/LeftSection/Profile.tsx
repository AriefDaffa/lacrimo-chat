import Image from "next/image";
// import { IoMdPersonAdd } from "react-icons/io";
import type { FC } from "react";

import Flexer from "@/app/_components/Flexer";
import type { IUser } from "../../_types/IUser";

interface ProfileProps {
  profile?: IUser | null;
  isLoading: boolean;
  error: string;
}

const Profile: FC<ProfileProps> = ({ profile }) => {
  return (
    <Flexer flexDirection="row" gap="4">
      <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
        <Image
          src="/images/male-placeholder.png"
          alt=""
          width={100}
          height={100}
          className="size-full object-cover"
        />
      </div>
      <Flexer gap="1" className="flex-1 justify-center">
        <div className="text-lg font-semibold">{profile?.username}</div>
        <div className="text-sm text-c-gray-text">{profile?.email}</div>
      </Flexer>
      {/* <Flexer className="justify-center">
        <div className="rounded-md border-2 border-gray-200 p-2">
          <IoMdPersonAdd size={24} className="text-c-gray-text" />
        </div>
      </Flexer> */}
    </Flexer>
  );
};

export default Profile;
