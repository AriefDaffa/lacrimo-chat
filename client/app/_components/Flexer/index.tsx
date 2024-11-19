import type { FC, ReactNode } from "react";

interface FlexerProps {
  children: ReactNode;
  gap?: string;
  className?: string;
  flexDirection?: "col" | "row";
}

const Flexer: FC<FlexerProps> = ({
  children,
  flexDirection = "col",
  gap = "2",
  className = "",
}) => {
  return (
    <div className={`flex flex-${flexDirection} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default Flexer;
