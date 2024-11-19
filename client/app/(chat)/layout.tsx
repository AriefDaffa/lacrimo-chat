import type { FC, ReactNode } from "react";
import { UserProfileProvider } from "./_contexts/UserProfileContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <UserProfileProvider>
      <div className="flex w-full bg-c-gray">
        <div className="mx-auto h-screen w-full max-w-screen-xl bg-c-gray p-4">
          {children}
        </div>
      </div>
    </UserProfileProvider>
  );
};

export default Layout;
