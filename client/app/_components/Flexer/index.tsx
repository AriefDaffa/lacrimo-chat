import type { FC, ReactNode } from "react";

interface FlexerProps {
  children: ReactNode;
  gap?: string;
  flexDirection?: "col" | "row";
}

const Flexer: FC<FlexerProps> = ({
  children,
  flexDirection = "col",
  gap = "2",
}) => {
  return (
    <div className={`flex flex-${flexDirection} gap-${gap}`}>{children}</div>
  );
};

export default Flexer;
