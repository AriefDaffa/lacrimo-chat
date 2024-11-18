import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "../_services/login";
import type { ILoginForm } from "../_types/ILoginForm";

const useLogin = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useRouter();

  const loginFunc = useCallback(
    async (props: ILoginForm) => {
      setIsLoading(true);
      setErrMsg("");

      const req = await login(props);

      const resp = await req.json();

      setIsLoading(false);

      if (req.status < 300) {
        setData(resp);
        navigate.replace("/");
      } else {
        setErrMsg(resp?.message || "Internal Server Error");
      }

      return req;
    },
    [navigate],
  );

  return { loginFunc, data, isLoading, errMsg };
};

export default useLogin;
