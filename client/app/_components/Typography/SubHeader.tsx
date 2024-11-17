import type { FC, ReactNode } from "react";

interface SubHeaderProps {
  children: ReactNode;
}

const SubHeader: FC<SubHeaderProps> = ({ children }) => {
  return <div className="font-semibold text-c-gray-text">{children}</div>;
};

export default SubHeader;
