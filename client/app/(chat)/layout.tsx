import type { FC, ReactNode } from "react";

import { UserProfileProvider } from "./_contexts/UserProfileContext";
import { ChatContextProvider } from "./_contexts/ChatContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <UserProfileProvider>
      <ChatContextProvider>
        <div className="flex w-full bg-c-gray">
          <div className="mx-auto h-screen w-full max-w-screen-xl bg-c-gray p-4">
            {children}
          </div>
        </div>
      </ChatContextProvider>
    </UserProfileProvider>
  );
};

export default Layout;
