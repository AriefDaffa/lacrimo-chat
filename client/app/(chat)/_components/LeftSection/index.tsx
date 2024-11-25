"use client";

import { ChangeEvent, useCallback, useState } from "react";

import Card from "@/app/_components/Card";
import Flexer from "@/app/_components/Flexer";

import Profile from "./Profile";
import ChatList from "./ChatList";
import SearchList from "./SearchList";
import SearchInput from "./SearchInput";
import useUserSearch from "../../_hooks/useUserSearch";
import { useUserProfile } from "../../_contexts/UserProfileContext";
import useMsgListSocket from "../../_hooks/useMsgListSocket";

const LeftSection = () => {
  const [keyword, setKeyword] = useState("");

  const { profile, loading, error } = useUserProfile();
  const { msgList } = useMsgListSocket();

  const { data: userList, isLoading: userSearchListLoading } =
    useUserSearch(keyword);

  const handleOnKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  return (
    <Card>
      <Flexer className="gap-4">
        <Profile profile={profile} isLoading={loading} error={error} />
        <SearchInput keyword={keyword} handleKeywordChange={handleOnKeyword} />
        {keyword === "" ? (
          <Flexer className="gap-1">
            <div className="text-xs font-bold text-gray-600">messages</div>
            {msgList?.length ? (
              msgList
                ?.filter((item) => item.users.id !== profile?.id)
                ?.map((item, idx) => (
                  <ChatList
                    key={idx}
                    users={item?.users}
                    username={item?.users?.username}
                    message={item?.messages?.message}
                  />
                ))
            ) : (
              <div className="">Loading...</div>
            )}
          </Flexer>
        ) : (
          <Flexer className="gap-1">
            <div className="text-xs font-bold text-gray-600">search list</div>
            {!userSearchListLoading ? (
              userList?.data?.map((item, idx) => (
                <SearchList key={idx} user={item} />
              ))
            ) : (
              <div className="">Loading...</div>
            )}
          </Flexer>
        )}
      </Flexer>
    </Card>
  );
};

export default LeftSection;
