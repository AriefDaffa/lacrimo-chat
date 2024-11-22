"use client";

import { FiSearch } from "react-icons/fi";
import { useMemo, useState } from "react";

import Card from "@/app/_components/Card";
import Flexer from "@/app/_components/Flexer";

import Profile from "./Profile";
import ChatList from "./ChatList";
import useMessageList from "../../_hooks/useMessageList";
import { useUserProfile } from "../../_contexts/UserProfileContext";
import useUserSearch from "../../_hooks/useUserSearch";
import SearchList from "./SearchList";

const LeftSection = () => {
  const [keyword, setKeyword] = useState("");

  const { profile, loading, error } = useUserProfile();
  const { data: userList, isLoading: userSearchListLoading } =
    useUserSearch(keyword);
  const { data: chatList, isLoading: messageListLoading } = useMessageList();

  const parentLoading = useMemo(
    () => userSearchListLoading || messageListLoading,
    [messageListLoading, userSearchListLoading],
  );

  return (
    <Card>
      <Flexer className="gap-4">
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
        {parentLoading ? (
          <div>Loading...</div>
        ) : keyword === "" ? (
          <Flexer className="gap-1">
            <div className="text-xs font-bold text-gray-600">messages</div>
            {chatList?.rooms
              ?.slice(1)
              ?.map((item, idx) => (
                <ChatList
                  key={idx}
                  users={item?.users}
                  username={item?.users?.username}
                  message={item?.messages?.message}
                />
              ))}
          </Flexer>
        ) : (
          <Flexer className="gap-1">
            <div className="text-xs font-bold text-gray-600">search list</div>
            {userList?.data?.map((item, idx) => (
              <SearchList key={idx} user={item} />
            ))}
          </Flexer>
        )}
      </Flexer>
    </Card>
  );
};

export default LeftSection;
