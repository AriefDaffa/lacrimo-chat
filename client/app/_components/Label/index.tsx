import type { FC } from "react";

interface LabelProps {
  text: string;
  htmlFor?: string;
}

const Label: FC<LabelProps> = ({ text, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold">
      {text}
    </label>
  );
};

export default Label;
