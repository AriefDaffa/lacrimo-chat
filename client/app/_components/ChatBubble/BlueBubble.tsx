import type { FC } from "react";

interface BlueBubbleProps {
  message: string;
}

const BlueBubble: FC<BlueBubbleProps> = ({ message }) => {
  return (
    <div className="w-fit max-w-[50%] self-end rounded-md bg-blue-200 px-3 py-2">
      {message}
    </div>
  );
};

export default BlueBubble;
