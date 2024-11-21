import { useEffect, useState } from "react";

import { searchUser } from "../_services/search-user";
import useDebouncedValue from "@/app/_hooks/useDebouncedValue";

const useUserSearch = (keyword: string) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const debouncedKeyword = useDebouncedValue(keyword, 500);

  useEffect(() => {
    if (debouncedKeyword) {
      const searchFunc = async () => {
        setIsLoading(true);
        setErrMsg("");

        const req = await searchUser(debouncedKeyword);

        const resp = await req.json();

        setIsLoading(false);

        if (req.status < 300) {
          setData(resp);
          // navigate.replace("/");
        } else {
          setErrMsg(resp?.message || "Internal Server Error");
        }
      };

      searchFunc();
    }
  }, [debouncedKeyword]);

  return { data, isLoading, errMsg };
};

export default useUserSearch;
