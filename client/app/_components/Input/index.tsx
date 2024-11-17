import type { ChangeEventHandler, FC, HTMLInputTypeAttribute } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface InputProps {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  id?: string;
  value?: string | readonly string[] | number | undefined;
  onChange?: ChangeEventHandler | undefined;
  errMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const Input: FC<InputProps> = ({
  type,
  placeholder,
  id,
  onChange,
  value,
  errMsg,
  ...props
}) => {
  return (
    <div className="">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border-2 p-2 outline-none ${errMsg !== "" ? "border-red-500" : "border-gray-200"}`}
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
