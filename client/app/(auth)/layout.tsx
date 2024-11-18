import Image from "next/image";
import type { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full items-center justify-center xl:w-1/2">
        {children}
      </div>
      <div className="hidden w-1/2 xl:block">
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
