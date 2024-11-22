import type { FC, ReactNode } from "react";

interface FlexerProps {
  children: ReactNode;
  gap?: string;
  className?: string;
  flexDirection?: "col" | "row";
  onClick?: () => void;
}

const Flexer: FC<FlexerProps> = ({
  children,
  flexDirection = "col",
  gap = "2",
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`flex flex-${flexDirection} gap-${gap} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Flexer;
