import { TbMessage2Bolt } from "react-icons/tb";
import type { FC } from "react";

import Header from "@/app/_components/Typography/Header";
import SubHeader from "@/app/_components/Typography/SubHeader";

interface LoginHeaderProps {}

const LoginHeader: FC<LoginHeaderProps> = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-min rounded-lg border-2 border-gray-200 p-2">
        <TbMessage2Bolt size={30} />
      </div>
      <Header>Sign in</Header>
      <SubHeader>Please login before using the system.</SubHeader>
    </div>
  );
};

export default LoginHeader;
