"use client";

import { FiSearch } from "react-icons/fi";
import { useState } from "react";

import Card from "@/app/_components/Card";
import Flexer from "@/app/_components/Flexer";

import Profile from "./Profile";
import { useUserProfile } from "../../_contexts/UserProfileContext";
// import { searchUser } from "../../_services/search-user";
// import useUserSearch from "../../_hooks/useUserSearch";
import useMessageList from "../../_hooks/useMessageList";
import ChatList from "./ChatList";

const LeftSection = () => {
  const [keyword, setKeyword] = useState("");

  const { profile, loading, error } = useUserProfile();

  // const { data: chatList, errMsg, isLoading } = useUserSearch(keyword);
  const { data: chatList } = useMessageList();

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
            placeholder="Search users"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Flexer>
        <div className="h-[1px] w-full bg-gray-200"></div>
        <Flexer className="gap-1">
          {chatList?.rooms?.map((item, idx) => (
            <ChatList
              key={idx}
              username={item?.users?.username}
              message={item?.messages?.message}
            />
          ))}
        </Flexer>
      </Flexer>
    </Card>
  );
};

export default LeftSection;
