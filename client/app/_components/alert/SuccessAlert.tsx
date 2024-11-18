import type { FC, ReactNode } from "react";

interface SuccessAlertProps {
  children: ReactNode;
}

const SuccessAlert: FC<SuccessAlertProps> = ({ children }) => {
  return (
    <div className="rounded-md border-2 border-green-500 bg-green-200 p-2 text-center font-semibold text-green-500">
      {children}
    </div>
  );
};

export default SuccessAlert;
