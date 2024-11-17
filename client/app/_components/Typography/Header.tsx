import type { FC, ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  return <div className="text-4xl font-semibold">{children}</div>;
};

export default Header;
