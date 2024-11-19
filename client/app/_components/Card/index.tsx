import type { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`size-full rounded-lg border bg-white p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
