import type { ChangeEventHandler, FC, HTMLInputTypeAttribute } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface InputProps {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  id?: string;
  value?: string | readonly string[] | number | undefined;
  onChange?: ChangeEventHandler | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  className?: string;
}

const Input: FC<InputProps> = ({
  type,
  placeholder,
  id,
  onChange,
  value,
  errMsg = "",
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border-2 p-2 outline-none ${errMsg !== "" ? "border-red-500" : "border-gray-200"} ${className}`}
        {...props}
      />
      {errMsg !== "" && (
        <div className="text-sm font-semibold text-red-500">
          {String(errMsg)}
        </div>
      )}
    </div>
  );
};

export default Input;
