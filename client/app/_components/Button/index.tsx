import type { FC } from "react";

interface ButtonProps {
  text: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ text, type, disabled }) => {
  return (
    <button
      type={type}
      className={`rounded-lg bg-blue-500 p-2 font-semibold text-white ${disabled && "brightness-75"}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
