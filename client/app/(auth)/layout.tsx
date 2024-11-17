import Image from "next/image";
import type { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full items-center justify-center p-20">
        {children}
      </div>
      <div className="w-full bg-red-200">
        <Image
          src="/images/login-pic.jpg"
          alt=""
          width={1000}
          height={1000}
          className="size-full object-cover"
        />
      </div>
    </div>
  );
};

export default layout;
