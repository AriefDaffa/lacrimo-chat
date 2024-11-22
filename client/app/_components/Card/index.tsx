import type { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  isChatCard?: boolean;
}

const Card: FC<CardProps> = ({ children, className, isChatCard = false }) => {
  return (
    <div
      className={`size-full rounded-lg border bg-white ${!isChatCard && "p-4"} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
