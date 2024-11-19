import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { searchUser } from "../_services/search-user";

const useUserSearch = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useRouter();

  const loginFunc = useCallback(
    async (keyword: string) => {
      setIsLoading(true);
      setErrMsg("");

      const req = await searchUser(keyword);

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

export default useUserSearch;
