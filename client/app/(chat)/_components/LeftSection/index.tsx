"use client";

import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";

import Card from "@/app/_components/Card";
import Flexer from "@/app/_components/Flexer";
import useDebouncedValue from "@/app/_hooks/useDebouncedValue";

import Profile from "./Profile";
import { useUserProfile } from "../../_contexts/UserProfileContext";
import { searchUser } from "../../_services/search-user";

const LeftSection = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const { profile, loading, error } = useUserProfile();

  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebouncedValue(keyword, 500);

  useEffect(() => {
    if (debouncedKeyword) {
      console.log("Search API call with:", debouncedKeyword);
      // Call your API or perform any search logic here
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

  console.log(data);

  return (
    <Card>
      <Flexer className="gap-6">
        <Profile profile={profile} isLoading={loading} error={error} />
        <Flexer
          flexDirection="row"
          className="items-center rounded-full border px-3"
        >
          <FiSearch size={20} className="text-gray-400" />
          <input
            value={keyword}
            type="text"
            className="w-full py-2 outline-none"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Flexer>
        {/* <FriendList /> */}
      </Flexer>
    </Card>
  );
};

export default LeftSection;
