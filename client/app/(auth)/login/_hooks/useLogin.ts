import { useCallback, useState } from "react";
import { ILoginForm } from "../_types/ILoginForm";

const useLogin = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const login = useCallback(async (props: ILoginForm) => {
    setIsLoading(true);
    setErrMsg("");

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/v1/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          password: props.password,
        }),
      },
    );

    const resp = await req.json();

    setIsLoading(false);

    if (req.status < 300) {
      setData(resp);
    } else {
      setErrMsg(resp?.message || "Internal Server Error");
    }

    return req;
  }, []);

  return { login, data, isLoading, errMsg };
};

export default useLogin;
