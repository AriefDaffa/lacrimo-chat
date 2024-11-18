import { TbMessage2Bolt } from "react-icons/tb";

import Header from "@/app/_components/Typography/Header";
import SubHeader from "@/app/_components/Typography/SubHeader";

const RegisterHeader = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-min rounded-lg border-2 border-gray-200 p-2">
        <TbMessage2Bolt size={30} />
      </div>
      <Header>Register</Header>
      <SubHeader>Create your account</SubHeader>
    </div>
  );
};

export default RegisterHeader;
