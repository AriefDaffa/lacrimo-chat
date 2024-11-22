import { useEffect, useState } from "react";

import useDebouncedValue from "@/app/_hooks/useDebouncedValue";
import { searchUser } from "../_services/search-user";
import type { IUserSearch } from "../_types/IUserSearch";

const useUserSearch = (keyword: string) => {
  const [data, setData] = useState<IUserSearch>();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const debouncedKeyword = useDebouncedValue(keyword, 500);

  useEffect(() => {
    if (debouncedKeyword) {
      const searchFunc = async () => {
        setIsLoading(true);
        setErrMsg("");
        setData({
          success: false,
          message: "",
          data: null,
        });

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
