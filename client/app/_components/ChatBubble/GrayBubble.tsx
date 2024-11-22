import type { FC } from "react";

interface GrayBubbleProps {
  message: string;
}

const GrayBubble: FC<GrayBubbleProps> = ({ message }) => {
  return (
    <div className="w-fit max-w-[50%] rounded-md bg-gray-200 px-3 py-2">
      {message}
    </div>
  );
};

export default GrayBubble;
