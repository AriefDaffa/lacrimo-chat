"use client";

import { FiSend } from "react-icons/fi";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const Page = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [oldMsg, setOldMsg] = useState<{ senderID: number; message: string }[]>(
    [],
  );
  const [currentMsg, setCurrentMsg] = useState<
    { senderID: number; message: string }[]
  >([]);
  const [currUserID, setCurrUserID] = useState(0);

  const socket = useRef<WebSocket | null>(null);

  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJSYXl5IiwiZW1haWwiOiJjQG1haWwuY29tIiwiZXhwIjoxNzMyNTExNjA5fQ.x8UyB5JC0xJ7JA3QSYc9Bdu-axJPl1D18qiw8s7YqkI";

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMsgInput(e.target.value);
  };

  const handleSubmit = () => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(msgInput);
      setMsgInput("");
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const req = await fetch("http://localhost:5000/v1/message?id=3", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (req.status < 300) {
        const resp = await req.json();
        setCurrUserID(resp?.data.user.id);
        resp.data.messages.forEach((item) => {
          setOldMsg((prev) => [
            ...prev,
            { senderID: item.sender, message: item.message },
          ]);
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:5000/v1/chat?id=3", [token]);

    socket.current.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connection established");
    };

    socket.current.onmessage = (e) => {
      const parsedData = JSON.parse(e.data);
      setCurrentMsg((prev) => [
        ...prev,
        {
          senderID: parsedData?.senderID,
          message: parsedData?.message,
        },
      ]);
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.current?.close();
      console.log("WebSocket connection cleaned up");
    };
  }, []);

  return (
    <div className="flex w-full bg-c-gray">
      <div className="mx-auto h-screen w-full max-w-screen-xl bg-c-gray p-4">
        <div className="flex size-full gap-4">
          <div className="w-1/3 rounded-lg border bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-red-200">
                <Image
                  src={"/images/pp.jpg"}
                  alt=""
                  width={500}
                  height={500}
                  className="size-full object-cover"
                />
              </div>
              <div className="">
                <div className="text-base font-semibold">Fernando</div>
                <div className="text-sm text-c-gray-text">Available</div>
              </div>
            </div>
          </div>
          <div className="flex w-2/3 flex-col rounded-lg border bg-white">
            <div className="">
              <div className="flex items-center gap-4 border-b p-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-red-200">
                  <Image
                    src={"/images/pp.jpg"}
                    alt=""
                    width={500}
                    height={500}
                    className="size-full object-cover"
                  />
                </div>
                <div className="">
                  <div className="text-base font-semibold">Alnando</div>
                  <div className="text-sm text-c-gray-text">Available</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-scroll px-4">
              <div className="">Status {String(isConnected)}</div>
              <div className="flex flex-col gap-2 pb-2">
                {/* {msg.map((item, key) => (
                  <div className="" key={key}>
                    {item}
                  </div>
                ))} */}
                {oldMsg.map((item, id) =>
                  item.senderID !== currUserID ? (
                    <div
                      key={`${item.message}-${id}`}
                      className="w-fit max-w-[50%] rounded-md bg-c-gray p-2"
                    >
                      {item.message}
                    </div>
                  ) : (
                    <div
                      key={`${item.message}-${id}`}
                      className="w-fit max-w-[50%] self-end rounded-md bg-blue-200 p-2"
                    >
                      {item.message}
                    </div>
                  ),
                )}
                {currentMsg
                  .filter((item) => item.senderID)
                  .map((item, id) =>
                    item.senderID !== currUserID ? (
                      <div
                        key={`${item.message}-${id}`}
                        className="w-fit max-w-[50%] rounded-md bg-c-gray p-2"
                      >
                        {item.message}
                      </div>
                    ) : (
                      <div
                        key={`${item.message}-${id}`}
                        className="w-fit max-w-[50%] self-end rounded-md bg-blue-200 p-2"
                      >
                        {item.message}
                      </div>
                    ),
                  )}
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex items-center gap-4 border-t p-4"
            >
              <div className="flex-1">
                <input
                  value={msgInput}
                  className="size-full rounded-full bg-c-gray px-4 py-3 outline-none"
                  type="text"
                  placeholder="Write a message..."
                  onChange={handleOnChange}
                />
              </div>
              {/* <div className="">1</div> */}
              <div className="flex cursor-pointer items-center justify-center rounded-full bg-blue-600 p-3 text-white">
                <FiSend className="mt-[1px]" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
