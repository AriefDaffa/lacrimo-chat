import type { FC, ReactNode } from "react";

interface ErrorAlertProps {
  children: ReactNode;
}

const ErrorAlert: FC<ErrorAlertProps> = ({ children }) => {
  return (
    <div className="rounded-md border-2 border-red-500 bg-red-200 p-2 text-center font-semibold text-red-500">
      {children}
    </div>
  );
};

export default ErrorAlert;
