import { useCallback, useState } from "react";

import { register } from "../_services/register";
import type { IRegisterForm } from "../_types/IRegisterForm";

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const registerFunc = useCallback(async (props: IRegisterForm) => {
    setIsLoading(true);
    setIsSuccess(false);
    setErrMsg("");

    const req = await register(props);

    const resp = await req.json();

    setIsLoading(false);

    if (req.status < 300) {
      setIsSuccess(true);
      // navigate.replace("/");
    } else {
      setErrMsg(resp?.message || "Internal Server Error");
    }

    return req;
  }, []);

  return { registerFunc, isSuccess, isLoading, errMsg };
};

export default useRegister;
